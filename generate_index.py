#!/usr/bin/env python3
"""Generate a GitHub Pages gallery from project subdirectories.

Run from the interactive-fiction repository root:
    python3 generate_index.py

Each top-level directory (except hidden directories) is a collection.
Each immediate child directory containing index.html is a published project.
"""

from html import escape
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "index.html"

# Optional: exclude top-level folders that aren't story collections.
EXCLUDED_COLLECTIONS = {"assets", "images", "sounds", "css", "js", "scripts", "node_modules", "__pycache__"}


def display_name(folder_name: str) -> str:
    """Turn a folder slug into a readable heading."""
    return folder_name.replace("-", " ").replace("_", " ").title()


def discover_collections():
    collections = []
    for collection in sorted(ROOT.iterdir(), key=lambda p: p.name.casefold()):
        if not collection.is_dir() or collection.name.startswith(".") or collection.name in EXCLUDED_COLLECTIONS:
            continue
        projects = []
        for project in sorted(collection.iterdir(), key=lambda p: p.name.casefold()):
            if project.is_dir() and not project.name.startswith(".") and (project / "index.html").is_file():
                path = f"{quote(collection.name)}/{quote(project.name)}/index.html"
                projects.append((display_name(project.name), path))
        if projects:
            collections.append((display_name(collection.name), projects))
    return collections


def generate_html(collections):
    sections = []
    for collection_title, projects in collections:
        links = "\n".join(
            f'          <li><a href="{escape(href, quote=True)}">{escape(title)}</a></li>'
            for title, href in projects
        )
        sections.append(
            '      <section class="collection">\n'
            f'        <h2>{escape(collection_title)}</h2>\n'
            '        <ul class="story-list">\n'
            f'{links}\n'
            '        </ul>\n'
            '      </section>'
        )
    content = "\n".join(sections) if sections else (
        '      <p class="empty">No published stories yet. '
        'Add a project folder containing an <code>index.html</code> and rerun this script.</p>'
    )
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Interactive Fiction | Story Gallery</title>
  <style>
    :root {{ color-scheme: light; }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: #f6f7fb;
      color: #202a39;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }}
    header {{ background: #183153; color: white; padding: 3rem 1.5rem; }}
    header .wrap, main {{ max-width: 900px; margin: 0 auto; }}
    h1 {{ margin: 0; font-size: clamp(2rem, 5vw, 3rem); line-height: 1.2; }}
    header p {{ margin: .7rem 0 0; color: #d7e5f7; }}
    main {{ padding: 2rem 1.5rem 4rem; }}
    .collection {{ margin-bottom: 2.5rem; }}
    h2 {{ border-bottom: 2px solid #d9e1ea; padding-bottom: .4rem; margin-bottom: 1rem; }}
    .story-list {{ padding: 0; margin: 0; list-style: none; display: grid; gap: .7rem; }}
    .story-list a {{
      display: block; padding: .85rem 1.1rem; background: white;
      color: #164c84; border: 1px solid #d9e1ea; border-radius: 8px;
      text-decoration: none; font-weight: 600;
    }}
    .story-list a:hover, .story-list a:focus-visible {{
      background: #eaf2fb; text-decoration: underline; outline-offset: 3px;
    }}
    .empty {{ color: #586579; }}
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <h1>Interactive Fiction</h1>
      <p>Explore interactive stories and classroom examples.</p>
    </div>
  </header>
  <main>
{content}
  </main>
</body>
</html>
'''


def main():
    collections = discover_collections()
    OUTPUT.write_text(generate_html(collections), encoding="utf-8")
    count = sum(len(projects) for _, projects in collections)
    print(f"Generated {OUTPUT.name}: {count} project(s) across {len(collections)} collection(s).")
    for title, projects in collections:
        print(f"  {title}: {len(projects)}")


if __name__ == "__main__":
    main()
