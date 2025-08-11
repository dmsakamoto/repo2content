# Examples

This directory contains examples of how to use repo2content.

## marketing-repo/

A complete example of a marketing repository setup with:
- `repo2content.config.yaml` - Configuration file
- Will generate `content/` and `_companion/` directories when run

## fetch-url-example/

A complete example of URL fetching setup with:
- `repo2content.config.yaml` - Configuration file with URL fetching sources
- Demonstrates fetching content directly from web URLs
- Will generate `content/` directory with fetched pages as Markdown

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

### Repository Extraction
1. Navigate to `examples/marketing-repo/`
2. Edit `repo2content.config.yaml` to point to your source repository
3. Run `repo2content pull` to extract content

### URL Fetching
1. Navigate to `examples/fetch-url-example/`
2. Edit `repo2content.config.yaml` to specify the URLs you want to fetch
3. Run `repo2content pull` to fetch and convert URLs to Markdown

### Command Line URL Fetching
You can also fetch URLs directly from the command line:
```bash
repo2content pull --fetch-urls "https://example.com,https://example.com/about"
```
