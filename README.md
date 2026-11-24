# 📝 Hành Trình của Eri

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

Personal blog of Eri, built with [Astro](https://astro.build) and based on the [Fuwari](https://github.com/saicaca/fuwari) template.

[**🖥️ Visit the blog**](https://blog.eridev.asia)

## 🧱 Stack & Third-party Services

Quick map of everything the blog depends on. Check here first when something breaks.

| Service | Purpose | Where to manage | Notes |
|:--|:--|:--|:--|
| **Astro 5** + Tailwind + Svelte | Static site generator, UI | This repo | Template: [Fuwari](https://github.com/saicaca/fuwari) (forked) |
| **Vercel** | Hosting and auto deploy on every push to `main` | Vercel dashboard → project `fuwari-blog` | Env vars live in Project Settings → Environment Variables |
| **Domain** `blog.eridev.asia` | Custom domain | Vercel → Settings → Domains, DNS at the domain registrar | Site URL is controlled by `SITE_URL` |
| **Supabase** | Database for the comment system (`comments` table) | Supabase dashboard | Free tier pauses after about 7 days of inactivity |
| **GitHub Actions** | `Keep Supabase Alive` workflow queries Supabase every 2 days | Repo → Actions | Needs repo secrets (see below). Scheduled runs can be delayed or skipped |
| **UptimeRobot** | Pings `https://blog.eridev.asia/` every 5 minutes (uptime + keeps site warm) | uptimerobot.com | Free plan, 1 HTTP monitor |
| **GitHub GraphQL API** | Fetches pinned repos for the About page at build time | Personal access token in GitHub → Settings → Developer settings | Token needs no scopes. If it expires, the About page falls back to a static list |
| **Pagefind** | Static search index, generated during build | Build step | No account needed |
| **Obsidian + Templater** | Writing environment (local only) | Local machine | See "Writing a new post" |

## 🔐 Environment Variables

Copy `env.example` to `.env` for local development. On Vercel set them in Project Settings → Environment Variables, then redeploy.

| Variable                    | Where used          | Description                                                        |
|:----------------------------|:--------------------|:-------------------------------------------------------------------|
| `SITE_URL`                  | `astro.config.mjs`  | Site domain, default `https://blog.eridev.asia/`. Change when the domain changes |
| `PUBLIC_SUPABASE_URL`       | Comment system      | Supabase project URL                                               |
| `PUBLIC_SUPABASE_ANON_KEY`  | Comment system      | Supabase anon key                                                  |
| `GITHUB_TOKEN`              | About page (build)  | Token used to read pinned repos via GraphQL                        |
| `GITHUB_USERNAME`           | About page (build)  | GitHub username whose pinned repos are shown                       |

GitHub repository secrets (Settings → Secrets and variables → Actions), used by `Keep Supabase Alive`:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

## ✍️ Writing a New Post

Posts are written in Obsidian and previewed with the dev server.

**One-time setup**
1. Open `src/content/posts` as an Obsidian vault (*Open folder as vault*, not *Create new vault*).
2. Settings → Files and links:
   - Default location for new attachments: *Same folder as current file*
   - Use [[Wikilinks]]: off
   - New link format: *Relative path to file*
3. Install the **Templater** community plugin, set Template folder location to `_templates`.
4. Settings → Hotkeys: bind *Templater: Create new note from template* to **Ctrl + Cmd + N**.

**Every new post**
1. Press **Ctrl + Cmd + N** and choose the `post` template, then enter the post title.
   A folder `slug/index.md` is created with frontmatter and `draft: true`.
2. Fill in `description`, `tags`, `category`, then write the content.
3. Paste images with Cmd + V. Rename them without spaces and link as `![alt](./image.png)`. Cover image goes in `image: "./thumbnail.jpg"`.
4. Preview: run `pnpm dev` and open `localhost:4321`. Drafts are visible in dev mode only.
5. When ready, set `draft: false`, then `git add`, `commit`, `push`. Vercel deploys automatically.

**Good to know**
- Edit frontmatter in Obsidian *Source mode* (Cmd + E). The Properties panel may rewrite the YAML and flag tags with spaces in red, which is harmless for Astro.
- Prefer GitHub-style callouts (`> [!NOTE]`) so they render in both Obsidian and the site. Fuwari-only syntax (`:::tip[Title]`, `::github{repo="..."}`, code block options) is listed inside the template.
- `_templates/` and `.obsidian/` are not part of the site: Astro ignores files starting with `_`, and `.obsidian/` is gitignored.

## 📌 About Page: Pinned Repos

The "Repo nổi bật" section is generated at build time from the pinned repos of the GitHub profile (`src/utils/github-pinned.ts`, rendered by `src/components/misc/GithubPinnedCards.astro`). Data is fetched with `GITHUB_TOKEN`, so visitors never hit the GitHub API rate limit.
- After changing pinned repos on GitHub, redeploy on Vercel to update the site.
- If the token is missing or expired, a static fallback list in `GithubPinnedCards.astro` is used.

## 🚀 Local Development

1. Install [pnpm](https://pnpm.io) if you haven't: `npm install -g pnpm`
2. `pnpm install`
3. Copy `env.example` to `.env` and fill in the values.
4. `pnpm dev` and open `localhost:4321`.

## ⚡ Commands

| Command                    | Action                                           |
|:---------------------------|:-------------------------------------------------|
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`      |
| `pnpm build`               | Builds the production site to `./dist/`          |
| `pnpm preview`             | Previews the build locally                       |
| `pnpm check`               | Runs checks for errors in the code               |
| `pnpm format`              | Formats the code using Biome                     |
| `pnpm new-post <filename>` | Creates a post from the terminal (alternative to Obsidian) |

## 🛠️ Troubleshooting

| Symptom | Likely cause | Fix |
|:--|:--|:--|
| Comments fail to load or save | Supabase project paused | Restore it in the Supabase dashboard, check that `Keep Supabase Alive` runs and its secrets exist |
| About page repo cards show "Waiting for api.github.com..." | `GITHUB_TOKEN` missing or expired, build used the fallback | Check the build log for `[github-pinned]`, update the token on Vercel, redeploy |
| Site shows the old domain in links or RSS | `SITE_URL` not updated | Update `SITE_URL` on Vercel and redeploy |
| Scheduled GitHub Action does not run | GitHub skips or delays cron on forks and busy periods | Use UptimeRobot for anything time-critical |
| Draft post not visible online | Expected: drafts are hidden in production | Set `draft: false` |

## 🙏 Credits

Based on [Fuwari](https://github.com/saicaca/fuwari) by [saicaca](https://github.com/saicaca), licensed under the MIT License.

## 📄 License

This project is licensed under the MIT License.
