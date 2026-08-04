//! Tiny dependency-free development server for the slide deck.
//! Compile with: rustc server.rs -o target/model-m-talk-server

use std::env;
use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Component, Path, PathBuf};

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

    let Some(path) = safe_path(raw_path) else {
        return send(
            &mut stream,
            method,
            "400 Bad Request",
            "text/plain",
            b"Invalid path",
        );
    };

    match fs::read(&path) {
        Ok(body) => send(&mut stream, method, "200 OK", mime_type(&path), &body),
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
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    );
    stream.write_all(headers.as_bytes())?;
    if method != "HEAD" {
        stream.write_all(body)?;
    }
    stream.flush()
}
