//! Tiny dependency-free development server for the slide deck.
//! Compile with: rustc server.rs -o target/model-m-talk-server

use std::env;
use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Component, Path, PathBuf};
use std::time::UNIX_EPOCH;

/// Requests to this path return a signature of the deck's current file
/// state so `LIVE_RELOAD_SCRIPT` can detect edits and reload the page. It
/// is not a real file, so it is matched before any filesystem lookup.
const LIVE_RELOAD_PATH: &str = "/__live-reload__";

const LIVE_RELOAD_SCRIPT: &str = r#"<script>
(() => {
  let known = null;
  const reloadCurrentDeck = () => {
    const configuredPath = document.documentElement.dataset.presentationUrl;
    if (!configuredPath) {
      location.reload();
      return;
    }

    const target = new URL(configuredPath, document.baseURI);
    target.search = location.search;
    target.hash = location.hash;
    if (target.href === location.href) {
      location.reload();
    } else {
      location.replace(target.href);
    }
  };
  const poll = async () => {
    try {
      const response = await fetch("/__live-reload__", { cache: "no-store" });
      const value = await response.text();
      if (known !== null && value !== known) {
        reloadCurrentDeck();
        return;
      }
      known = value;
    } catch (error) {
      // Server restarting or unreachable; keep retrying.
    }
    window.setTimeout(poll, 1000);
  };
  poll();
})();
</script>
"#;

fn main() -> std::io::Result<()> {
    let port = env::args().nth(1).unwrap_or_else(|| "8000".into());
    let address = format!("127.0.0.1:{port}");
    let listener = TcpListener::bind(&address)?;
    println!("Serving Model M talk at http://{address}");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                if let Err(error) = respond(stream) {
                    eprintln!("request failed: {error}");
                }
            }
            Err(error) => eprintln!("connection failed: {error}"),
        }
    }
    Ok(())
}

fn respond(mut stream: TcpStream) -> std::io::Result<()> {
    let mut request = [0_u8; 4096];
    let bytes_read = stream.read(&mut request)?;
    let request = String::from_utf8_lossy(&request[..bytes_read]);
    let mut request_line = request
        .lines()
        .next()
        .unwrap_or_default()
        .split_whitespace();
    let method = request_line.next().unwrap_or_default();
    let raw_path = request_line
        .next()
        .unwrap_or("/")
        .split('?')
        .next()
        .unwrap_or("/");

    if method != "GET" && method != "HEAD" {
        return send(
            &mut stream,
            method,
            "405 Method Not Allowed",
            "text/plain",
            b"Method not allowed",
        );
    }

    if raw_path == LIVE_RELOAD_PATH {
        let signature = deck_signature(Path::new(".")).unwrap_or_default();
        return send(
            &mut stream,
            method,
            "200 OK",
            "text/plain; charset=utf-8",
            signature.to_string().as_bytes(),
        );
    }

    let Some(mut path) = safe_path(raw_path) else {
        return send(
            &mut stream,
            method,
            "400 Bad Request",
            "text/plain",
            b"Invalid path",
        );
    };

    if path.is_dir() {
        path.push("index.html");
    }

    if let Some(manifest_dir) = subfolder_manifest_dir(&path) {
        return match generate_manifest(manifest_dir) {
            Ok(body) => send(
                &mut stream,
                method,
                "200 OK",
                "text/javascript; charset=utf-8",
                body.as_bytes(),
            ),
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => send(
                &mut stream,
                method,
                "404 Not Found",
                "text/plain",
                b"Not found",
            ),
            Err(error) => Err(error),
        };
    }

    match fs::read(&path) {
        Ok(body) => {
            let content_type = mime_type(&path);
            let body = if content_type.starts_with("text/html") && is_page_shell(&path) {
                inject_live_reload(body)
            } else {
                body
            };
            send(&mut stream, method, "200 OK", content_type, &body)
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => send(
            &mut stream,
            method,
            "404 Not Found",
            "text/plain",
            b"Not found",
        ),
        Err(error) => Err(error),
    }
}

fn safe_path(raw_path: &str) -> Option<PathBuf> {
    let relative = raw_path.trim_start_matches('/');
    let relative = if relative.is_empty() {
        "index.html"
    } else {
        relative
    };
    let path = Path::new(relative);
    if path
        .components()
        .any(|part| !matches!(part, Component::Normal(_)))
    {
        return None;
    }
    Some(path.to_path_buf())
}

/// Requests for `<subfolder>/slide-manifest.js` are generated from that
/// folder's slide fragments instead of read from disk, so a numbered,
/// non-interleaved slide group never needs a hand-maintained manifest.
/// Root-level manifests are unaffected because they have no parent folder
/// and may include archived slides or a custom order.
fn subfolder_manifest_dir(path: &Path) -> Option<&Path> {
    if path.file_name()? != "slide-manifest.js" {
        return None;
    }
    let parent = path.parent()?;
    (!parent.as_os_str().is_empty()).then_some(parent)
}

fn generate_manifest(dir: &Path) -> std::io::Result<String> {
    let mut names: Vec<String> = fs::read_dir(dir)?
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| entry.file_name().into_string().ok())
        .filter(|name| name.ends_with(".html") && name != "index.html")
        .collect();
    names.sort();

    let mut manifest = String::from("window.SLIDE_FILES = [\n");
    for name in &names {
        manifest.push_str(&format!("  \"{}/{name}\",\n", dir.display()));
    }
    manifest.push_str("];\n");
    Ok(manifest)
}

/// Page shells get the live-reload poller injected. Slide fragments fetched
/// by `slide-loader.js` and set via `innerHTML` are excluded — a `<script>`
/// tag inserted that way never executes, and would just show up as inert
/// markup in the slide.
fn is_page_shell(path: &Path) -> bool {
    let is_html = path.extension().and_then(|ext| ext.to_str()) == Some("html");
    if !is_html {
        return false;
    }
    !path.components().any(|component| {
        matches!(
            component,
            Component::Normal(name) if name == "slides" || name == "slides-discovery"
        )
    })
}

fn inject_live_reload(body: Vec<u8>) -> Vec<u8> {
    let needle = b"</body>";
    let Some(offset) = body
        .windows(needle.len())
        .position(|window| window == needle)
    else {
        return body;
    };
    let mut injected = Vec::with_capacity(body.len() + LIVE_RELOAD_SCRIPT.len());
    injected.extend_from_slice(&body[..offset]);
    injected.extend_from_slice(LIVE_RELOAD_SCRIPT.as_bytes());
    injected.extend_from_slice(&body[offset..]);
    injected
}

/// Walks the deck directory and returns the latest file modification time
/// (milliseconds since the epoch) as a cheap change signature. `target/`
/// and dotfiles are skipped since they are build output, not deck content.
fn deck_signature(dir: &Path) -> std::io::Result<u128> {
    let mut latest = 0_u128;
    let mut pending = vec![dir.to_path_buf()];

    while let Some(current) = pending.pop() {
        for entry in fs::read_dir(&current)? {
            let entry = entry?;
            let name = entry.file_name();
            let name = name.to_string_lossy();
            if name.starts_with('.') || name == "target" {
                continue;
            }

            let metadata = entry.metadata()?;
            if metadata.is_dir() {
                pending.push(entry.path());
                continue;
            }

            if let Ok(modified) = metadata.modified() {
                if let Ok(elapsed) = modified.duration_since(UNIX_EPOCH) {
                    latest = latest.max(elapsed.as_millis());
                }
            }
        }
    }

    Ok(latest)
}

fn mime_type(path: &Path) -> &'static str {
    match path
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or_default()
    {
        "html" => "text/html; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "js" => "text/javascript; charset=utf-8",
        "png" => "image/png",
        "webp" => "image/webp",
        "svg" => "image/svg+xml",
        "mp4" => "video/mp4",
        "webm" => "video/webm",
        _ => "application/octet-stream",
    }
}

fn send(
    stream: &mut TcpStream,
    method: &str,
    status: &str,
    content_type: &str,
    body: &[u8],
) -> std::io::Result<()> {
    let headers = format!(
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n",
        body.len()
    );
    stream.write_all(headers.as_bytes())?;
    if method != "HEAD" {
        stream.write_all(body)?;
    }
    stream.flush()
}
