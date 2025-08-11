import { htmlToMarkdown, stableHash } from './util.js';

export type UrlPage = { url: string; html: string };
export type PageOut = { target: string; frontmatter: Record<string, any>; body: string };

export async function extractFromUrls(origin: string, pages: UrlPage[], opts: { root: string }): Promise<PageOut[]> {
  const out: PageOut[] = [];
  for (const p of pages) {
    const md = htmlToMarkdown(p.html).trim();
    const title = (md.match(/^#\s+(.+)$/m)?.[1]) || p.url;
    const rel = mapUrlToRel(p.url, origin);
    const target = `${opts.root}/${rel}`;
    const content_hash = stableHash(md);
    out.push({ target, frontmatter: { title, slug: rel.replace(/\.md$/, ''), canonical_url: p.url, source: { type: 'url', url: p.url }, sync: { content_hash } }, body: md });
  }
  return out;
}

function mapUrlToRel(url: string, origin: string) {
  try {
    const u = new URL(url);
    const o = new URL(origin);
    let rel = u.pathname;
    if (u.host !== o.host) rel = `external${rel}`;
    if (rel.endsWith('/')) rel += 'index';
    if (!rel.endsWith('.md')) rel += '.md';
    return rel.replace(/^\//, '');
  } catch {
    return `pages/${Buffer.from(url).toString('hex')}.md`;
  }
}
