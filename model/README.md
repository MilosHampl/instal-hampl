# Contentful content model (as code)

`content-model.js` is a [`contentful-migration`](https://github.com/contentful/contentful-migration)
script that creates every content type the site needs. Field/type IDs match the
code in `src/lib/contentful/normalize.ts` — keep them in sync.

Human-readable spec: [`../docs/CONTENTFUL-MODEL.md`](../docs/CONTENTFUL-MODEL.md).

## Apply it

```bash
# 1. Install the CLI (once)
npm i -g contentful-cli

# 2. Authenticate (opens a browser to grab a token)
contentful login

# 3. Select the target space
contentful space use --space-id <YOUR_SPACE_ID>

# 4. Run the migration against an environment (default: master)
contentful space migration --environment-id master model/content-model.js
# …or simply:
npm run cf:migrate
```

The CLI prints the planned changes and asks for confirmation before applying.

## Notes
- **First run only.** The migration uses `createContentType` — re-running errors
  on types that already exist. For later changes, add a NEW migration file that
  uses `editContentType` / `editField` / `deleteField`, and run it the same way.
  Keeping one file per change gives you an ordered, reviewable schema history.
- After applying, create one **`siteSettings`** entry and the **`page`** entries
  listed in the docs (slugs: `home`, `prodejna`, `sluzby/cisteni-kanalizace`, …).
- Prefer a workflow? `contentful space export --content-model-only` snapshots the
  live model to JSON; `contentful space import --content-model-only` restores it.
