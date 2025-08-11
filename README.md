# repo2content
Mirror page content from a repo (MD/MDX/HTML) or a list of URLs into a marketing repo as Markdown.

A tiny, clean slate you can run today. Two commands: init and pull.

Goal: Mirror page content from a repo (MD/MDX/HTML) or a list of URLs into a marketing repo as Markdown.

Sync: Manual. No Actions, no fancy diff. Keep it boring and predictable.



repo2content/
├─ package.json
├─ tsconfig.json
├─ .gitignore
├─ README.md
├─ src/
│  ├─ cli.ts
│  ├─ config.ts
│  ├─ extract-repo.ts
│  ├─ extract-url.ts
│  ├─ map.ts
│  └─ util.ts
└─ examples/
   └─ marketing-repo/
      ├─ repo2content.config.yaml
      ├─ content/.gitkeep
      └─ _companion/.gitkeep
