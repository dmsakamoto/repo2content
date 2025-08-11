#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';
import { loadConfig, Config } from './config.js';
import { extractFromRepo } from './extract-repo.js';
import { extractFromUrls, UrlPage } from './extract-url.js';

const program = new Command();
program.name('repo2content').version('0.0.1').description('Mirror content into a marketing repo as Markdown');

program.command('init').description('Create example config and folders').action(async () => {
  await fs.ensureDir('content');
  await fs.ensureDir('_companion');
  const cfgPath = path.join(process.cwd(), 'repo2content.config.yaml');
  if (!(await fs.pathExists(cfgPath))) {
    await fs.writeFile(cfgPath, `sources:\n  - type: repo\n    local_path: ../some-source-repo\n#  - type: url\n#    pages_file: ../url-pages.json\nmapping:\n  root_dir: content\n`);
  }
  console.log('Initialized. Edit repo2content.config.yaml and run `repo2content pull`.');
});

program.command('pull')
  .description('Read sources and write Markdown files')
  .option('--local-repo <path>', 'Override local repo path from config')
  .option('--urls <file>', 'Override URLs file from config')
  .action(async (options) => {
    const cfg = await loadConfig(process.cwd());
    const root = cfg.mapping?.root_dir || 'content';

    for (const s of cfg.sources) {
      if (s.type === 'repo') {
        const repoPath = options.localRepo || s.local_path;
        const pages = await extractFromRepo(path.resolve(process.cwd(), repoPath), { root });
        await writePages(pages);
      } else if (s.type === 'url') {
        const urlsFile = options.urls || s.pages_file;
        const raw = await fs.readFile(path.resolve(process.cwd(), urlsFile), 'utf8');
        const arr = JSON.parse(raw) as UrlPage[];
        const origin = arr[0]?.url ? new URL(arr[0].url).origin : 'https://example.com';
        const pages = await extractFromUrls(origin, arr, { root });
        await writePages(pages);
      }
    }

    console.log('Done.');
  });

program.parse();

async function writePages(pages: { target: string; frontmatter: any; body: string }[]) {
  for (const p of pages) {
    const abs = path.resolve(process.cwd(), p.target);
    await fs.ensureDir(path.dirname(abs));
    const fm = toYaml(p.frontmatter);
    await fs.writeFile(abs, `---\n${fm}---\n\n${p.body}\n`);
    console.log('Wrote', path.relative(process.cwd(), abs));
  }
}

function toYaml(obj: Record<string, any>) {
  // very simple YAML writer for MVP (no dependency)
  const lines: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    lines.push(`${k}: ${serialize(v)}`);
  }
  return lines.join('\n') + '\n';
}

function serialize(v: any): string {
  if (v == null) return "";
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return `[${v.map(serialize).join(', ')}]`;
  if (typeof v === 'object') return JSON.stringify(v);
  return JSON.stringify(String(v));
}