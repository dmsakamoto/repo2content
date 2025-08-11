import crypto from 'node:crypto';

export function stableHash(s: string) {
  return crypto.createHash('sha256').update(s.replace(/\r\n?/g, '\n').trim()).digest('hex');
}

export function toSlug(p: string) {
  return p.replace(/\\/g, '/').replace(/\.md$/, '').replace(/[^a-z0-9/]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

export function htmlToMarkdown(html: string) {
  // ultra‑simple, good enough for MVP; replace later with remark/rehype
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
    .replace(/<br\s*\/>/gi, '\n')
    .replace(/<[^>]+>/g, '');
}