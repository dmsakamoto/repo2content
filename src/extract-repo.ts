import fs from 'fs-extra';
import path from 'node:path';
import matter from 'gray-matter';
import { mapTargetPath } from './map.js';
import { stableHash } from './util.js';

export type PageOut = { target: string; frontmatter: Record<string, any>; body: string };

export async function extractFromRepo(localPath: string, opts: { root: string }): Promise<PageOut[]> {
  const files = await listFiles(localPath);
  const candidates = files.filter(f => /\.(mdx?|html?)$/i.test(f));
  const out: PageOut[] = [];
  for (const abs of candidates) {
    const rel = path.relative(localPath, abs).replace(/\\/g, '/');
    const raw = await fs.readFile(abs, 'utf8');

    let body = raw;
    let fm: any = {};
    if (/\.(mdx?|md)$/i.test(rel)) {
      const parsed = matter(raw);
      body = parsed.content.trim();
      fm = parsed.data || {};
    }

    const title = fm.title || guessTitle(body) || path.basename(rel).replace(path.extname(rel), '');
    const target = mapTargetPath(opts.root, rel);
    const content_hash = stableHash(body);

    out.push({
      target,
      frontmatter: { title, slug: slugFromTarget(target), source: { type: 'repo', path: rel }, sync: { content_hash } },
      body
    });
  }
  return out;
}

async function listFiles(dir: string): Promise<string[]> {
  const stack = [dir];
  const out: string[] = [];
  while (stack.length) {
    const d = stack.pop()!;
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p); else out.push(p);
    }
  }
  return out;
}

function guessTitle(md: string): string | undefined {
  const m = md.match(/^#\s+(.+)$/m);
  return m?.[1];
}

function slugFromTarget(t: string) {
  return t.replace(/^.*content\//, '').replace(/\.md$/, '').replace(/[^a-z0-9/]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}