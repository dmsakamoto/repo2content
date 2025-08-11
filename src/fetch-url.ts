import fetch from 'node-fetch';
import { htmlToMarkdown, stableHash } from './util.js';

export type FetchUrlPage = { url: string; title?: string; slug?: string };
export type FetchedPage = { url: string; html: string; title?: string; slug?: string };
export type PageOut = { target: string; frontmatter: Record<string, any>; body: string };

export async function fetchUrl(url: string): Promise<FetchedPage> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; repo2content/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`Content-Type is not HTML: ${contentType}`);
    }

    return { url, html };
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchUrls(pages: FetchUrlPage[]): Promise<FetchedPage[]> {
  const results: FetchedPage[] = [];
  
  for (const page of pages) {
    try {
      console.log(`Fetching: ${page.url}`);
      const fetched = await fetchUrl(page.url);
      results.push({
        ...fetched,
        title: page.title,
        slug: page.slug
      });
    } catch (error) {
      console.error(`Error fetching ${page.url}:`, error instanceof Error ? error.message : String(error));
      // Continue with other URLs even if one fails
    }
  }
  
  return results;
}

export async function extractFromFetchedUrls(
  origin: string, 
  pages: FetchedPage[], 
  opts: { root: string }
): Promise<PageOut[]> {
  const out: PageOut[] = [];
  
  for (const page of pages) {
    try {
      const md = htmlToMarkdown(page.html).trim();
      
      // Extract title from HTML or use provided title
      let title = page.title;
      if (!title) {
        const titleMatch = page.html.match(/<title[^>]*>([^<]+)<\/title>/i);
        title = titleMatch?.[1]?.trim() || 
                md.match(/^#\s+(.+)$/m)?.[1] || 
                new URL(page.url).hostname;
      }
      
      // Use provided slug or generate from URL
      let slug = page.slug;
      if (!slug) {
        slug = mapUrlToSlug(page.url, origin);
      }
      
      const target = `${opts.root}/${slug}.md`;
      const content_hash = stableHash(md);
      
      out.push({
        target,
        frontmatter: {
          title,
          slug,
          canonical_url: page.url,
          source: { type: 'url', url: page.url },
          sync: { content_hash }
        },
        body: md
      });
    } catch (error) {
      console.error(`Error processing ${page.url}:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  return out;
}

function mapUrlToSlug(url: string, origin: string): string {
  try {
    const u = new URL(url);
    const o = new URL(origin);
    let slug = u.pathname;
    
    if (u.host !== o.host) {
      slug = `external${slug}`;
    }
    
    if (slug.endsWith('/')) {
      slug += 'index';
    }
    
    // Remove leading slash and file extensions
    slug = slug.replace(/^\//, '').replace(/\.(html|htm|php|asp|aspx)$/i, '');
    
    // If slug is empty, use hostname
    if (!slug) {
      slug = u.hostname.replace(/\./g, '-');
    }
    
    return slug;
  } catch {
    // Fallback: create a hash-based slug
    return `page-${Buffer.from(url).toString('hex').substring(0, 8)}`;
  }
}
