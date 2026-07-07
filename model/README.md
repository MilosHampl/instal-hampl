# Contentful content model (as code)

`content-model.js` is a [`contentful-migration`](https://github.com/contentful/contentful-migration)
script that creates every content type the site needs. Field/type IDs match the
code in `src/lib/contentful/normalize.ts` — keep them in sync.

Human-readable spec: [`../docs/CONTENTFUL-MODEL.md`](../docs/CONTENTFUL-MODEL.md).

## Apply it (env-driven — recommended)

`contentful-cli` + `dotenv-cli` are already devDependencies, and `cf:migrate` reads
your local `.env.local`. So all you do is fill three values and run one command:

```bash
# .env.local
CONTENTFUL_SPACE_ID=xxxxxxxxxxxx
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-...     # Settings → CMA tokens (personal access token)
```

```bash
npm run cf:migrate
```

This runs, under the hood:
`dotenv -e .env.local -- contentful space migration --space-id … --management-token … --environment-id … model/content-model.js`

The CLI prints the planned changes and asks for confirmation before applying.

> The **management token** (`CFPAT-…`) is different from the Delivery/Preview tokens
> the app uses to *read* content — it has read/write access to the whole space, so
> keep it out of git (`.env.local` is gitignored).

### Alternative: interactive login
```bash
npx contentful login                       # browser auth, stores a token
npx contentful space use --space-id <ID>
npx contentful space migration --environment-id master model/content-model.js
```

## Notes
- **First run only.** The migration uses `createContentType` — re-running errors
  on types that already exist. For later changes, add a NEW migration file that
  uses `editContentType` / `editField` / `deleteField`, and run it the same way.
  Keeping one file per change gives you an ordered, reviewable schema history.
- After applying, create one **`siteSettings`** entry and the **`page`** entries
  listed in the docs (slugs: `home`, `prodejna`, `sluzby/cisteni-kanalizace`, …).
- Prefer a workflow? `contentful space export --content-model-only` snapshots the
  live model to JSON; `contentful space import --content-model-only` restores it.
