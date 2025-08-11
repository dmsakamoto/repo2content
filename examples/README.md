# Examples

This directory contains examples of how to use repo2content.

## marketing-repo/

A complete example of a marketing repository setup with:
- `repo2content.config.yaml` - Configuration file
- Will generate `content/` and `_companion/` directories when run

## url-pages.json

Example JSON file containing URL pages data for testing URL extraction:
```json
[
  {
    "url": "https://example.com/page1",
    "html": "<html><body><h1>Example Page 1</h1><p>This is an example page.</p></body></html>"
  }
]
```

## Usage

1. Navigate to `examples/marketing-repo/`
2. Edit `repo2content.config.yaml` to point to your source repository
3. Run `repo2content pull` to extract content
