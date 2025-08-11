export function mapTargetPath(root: string, relative: string) {
    let out = relative.replace(/\.(mdx?|tsx|jsx|html?)$/i, '.md');
    if (!/\.md$/i.test(out)) out = out + '.md';
    return `${root}/${out}`.replace(/\\/g, '/');
  }