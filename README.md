# repo2content — Minimal MVP

Mirror content from a repo or URL list into a marketing repo as Markdown.

## Quick start
```bash
npm i
npm run build

# Try the example marketing repo
cd examples/marketing-repo
# 1) (optional) edit repo2content.config.yaml
# 2) Pull from a local repo folder (MD/MDX/HTML)
repo2content pull --local-repo ../../some-source-repo

# Or pull from a list of URLs (JSON array of {url, html})
repo2content pull --urls ../url-pages.json

---

## src/config.ts
```ts
import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'js-yaml';

export type SourceRepo = { type: 'repo'; local_path: string; include?: string[]; exclude?: string[] };
export type SourceUrl = { type: 'url'; pages_file: string }; // JSON array of { url, html }
export type Config = {
  sources: (SourceRepo | SourceUrl)[];
  mapping?: { root_dir?: string };
};

export async function loadConfig(cwd: string): Promise<Config> {
  const p = path.join(cwd, 'repo2content.config.yaml');
  if (!await fs.pathExists(p)) throw new Error('Missing repo2content.config.yaml');
  const raw = await fs.readFile(p, 'utf8');
  return yaml.load(raw) as Config;
}
