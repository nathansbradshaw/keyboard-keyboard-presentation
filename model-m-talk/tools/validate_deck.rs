use std::collections::HashSet;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

fn count(haystack: &str, needle: &str) -> usize {
    haystack.match_indices(needle).count()
}

fn manifest_files(manifest: &str) -> Vec<&str> {
    manifest
        .lines()
        .filter_map(|line| {
            let line = line.trim();
            line.strip_prefix('"')
                .and_then(|value| value.strip_suffix("\","))
                .filter(|value| {
                    (value.starts_with("slides/") || value.starts_with("slides-discovery/"))
                        && value.ends_with(".html")
                })
        })
        .collect()
}

fn local_sources(markup: &str) -> Vec<&str> {
    let mut sources = Vec::new();
    let mut remaining = markup;

    while let Some(start) = remaining.find("src=\"") {
        remaining = &remaining[start + 5..];
        let Some(end) = remaining.find('"') else {
            break;
        };
        let source = &remaining[..end];
        if !source.starts_with("http://")
            && !source.starts_with("https://")
            && !source.starts_with("data:")
        {
            sources.push(source);
        }
        remaining = &remaining[end + 1..];
    }

    sources
}

fn fail(message: impl Into<String>) -> io::Error {
    io::Error::other(message.into())
}

fn main() -> io::Result<()> {
    let mut arguments = std::env::args_os().skip(1);
    let deck_dir = arguments
        .next()
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("."));
    let index_name = arguments
        .next()
        .and_then(|value| value.into_string().ok())
        .unwrap_or_else(|| "index.html".into());
    let manifest_name = arguments
        .next()
        .and_then(|value| value.into_string().ok())
        .unwrap_or_else(|| "slide-manifest.js".into());
    let canonical_deck = manifest_name == "slide-manifest.js";
    let index = fs::read_to_string(deck_dir.join(&index_name))?;
    let manifest = fs::read_to_string(deck_dir.join(&manifest_name))?;
    let files = manifest_files(&manifest);

    if count(&index, "<section class=\"slide") != 0 {
        return Err(fail(format!("{index_name} still contains inline slides")));
    }
    for required in [manifest_name.as_str(), "slide-loader.js"] {
        if !index.contains(required) {
            return Err(fail(format!("{index_name} does not load {required}")));
        }
    }
    if canonical_deck && files.len() != 58 {
        return Err(fail(format!(
            "manifest contains {} slides instead of 58",
            files.len()
        )));
    }
    if files.is_empty() {
        return Err(fail("manifest contains no slides"));
    }

    let unique: HashSet<_> = files.iter().copied().collect();
    if unique.len() != files.len() {
        return Err(fail("manifest contains duplicate slide files"));
    }

    if canonical_deck {
        let disk_files: HashSet<String> = fs::read_dir(deck_dir.join("slides"))?
            .filter_map(Result::ok)
            .filter(|entry| entry.path().extension().and_then(|ext| ext.to_str()) == Some("html"))
            .map(|entry| format!("slides/{}", entry.file_name().to_string_lossy()))
            .collect();
        let manifest_set: HashSet<String> = files.iter().map(|file| (*file).to_string()).collect();
        if disk_files != manifest_set {
            return Err(fail("slide files on disk do not exactly match the canonical manifest"));
        }
    }

    let mut notes = 0;
    let mut auto_animate = 0;
    let mut staggered = 0;
    for file in &files {
        let path = deck_dir.join(file);
        let markup = fs::read_to_string(&path)?;
        if count(&markup, "<section class=\"slide") != 1 || count(&markup, "</section>") != 1 {
            return Err(fail(format!("{file} must contain exactly one slide section")));
        }
        let file_notes = count(&markup, "<aside class=\"notes\">");
        if file_notes != 1 {
            return Err(fail(format!("{file} contains {file_notes} speaker notes blocks")));
        }
        notes += file_notes;
        auto_animate += usize::from(markup.contains("data-auto-animate"));
        staggered += usize::from(markup.contains("data-stagger="));

        for source in local_sources(&markup) {
            if !deck_dir.join(Path::new(source)).is_file() {
                return Err(fail(format!("{file} references missing asset {source}")));
            }
        }
    }

    println!(
        "Validated {} slides from {}, {} notes, {} auto-animate slides, and {} slides with staged reveals.",
        files.len(), manifest_name, notes, auto_animate, staggered
    );
    Ok(())
}
