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
