# repo2content — Minimal MVP

Mirror content from a repo, URL list, or direct URL fetching into a marketing repo as Markdown.

## Quick start

### Prerequisites
- Node.js 18+ and npm (install from [nodejs.org](https://nodejs.org/))

### Setup
```bash
npm i
npm run build

# Optional: Install globally for easier access
npm link

# Try the example marketing repo
cd examples/marketing-repo
# 1) (optional) edit repo2content.config.yaml
# 2) Pull from a local repo folder (MD/MDX/HTML)
repo2content pull

# Or pull from a list of URLs (JSON array of {url, html})
# First, uncomment the url source in repo2content.config.yaml
# Then run: repo2content pull

# Or fetch URLs directly from the web
# repo2content pull --fetch-urls "https://example.com,https://example.com/about"

# You can also override config values with command line options:
# repo2content pull --local-repo ../../some-source-repo
# repo2content pull --urls ../url-pages.json
# repo2content pull --fetch-urls "https://example.com,https://example.com/about"

### Available Commands

- `repo2content init` - Create example config and folders
- `repo2content pull` - Read sources and write Markdown files
- `repo2content pull --local-repo <path>` - Override local repo path
- `repo2content pull --urls <file>` - Override URLs file
- `repo2content pull --fetch-urls <urls>` - Fetch URLs directly from the web

### Testing Configuration

To test your configuration without running the full extraction:

```bash
cd examples/marketing-repo
node test-config.js
```

---

## Project Structure

```
repo2content/
├── src/
│   ├── cli.ts          # Command-line interface
│   ├── config.ts       # Configuration loading and types
│   ├── extract-repo.ts # Extract content from local repositories
│   ├── extract-url.ts  # Extract content from URLs
│   ├── fetch-url.ts    # Fetch URLs directly from the web
│   ├── map.ts          # Path mapping utilities
│   └── util.ts         # General utilities (hashing, HTML conversion)
├── examples/
│   ├── marketing-repo/ # Example marketing repository
│   ├── fetch-url-example/ # Example URL fetching setup
│   └── url-pages.json  # Example URL pages data
└── package.json        # Dependencies and build scripts
```

## Configuration

### src/config.ts
```ts
import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'js-yaml';

export type SourceRepo = { type: 'repo'; local_path: string; include?: string[]; exclude?: string[] };
export type SourceUrl = { type: 'url'; pages_file: string }; // JSON array of { url, html }
export type SourceFetchUrl = { type: 'fetch-url'; urls: string[]; origin?: string }; // Direct URL fetching
export type Config = {
  sources: (SourceRepo | SourceUrl | SourceFetchUrl)[];
  mapping?: { root_dir?: string };
};

export async function loadConfig(cwd: string): Promise<Config> {
  const p = path.join(cwd, 'repo2content.config.yaml');
  if (!await fs.pathExists(p)) throw new Error('Missing repo2content.config.yaml');
  const raw = await fs.readFile(p, 'utf8');
  return yaml.load(raw) as Config;
}
