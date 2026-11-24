# 📝 Eri's Blog

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

Personal blog of Eri, built with [Astro](https://astro.build) and based on the [Fuwari](https://github.com/saicaca/fuwari) template.

[**🖥️ Visit the blog**](https://blog.eridev.asia)

## ✨ Features

- Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- Smooth animations and page transitions
- Light / dark mode
- Responsive design
- Search with [Pagefind](https://pagefind.app/)
- Table of contents and RSS feed
- Comments powered by [Supabase](https://supabase.com)
- Extended Markdown: admonitions, GitHub repository cards, [Expressive Code](https://expressive-code.com/)

## 🚀 Local Development

1. Install [pnpm](https://pnpm.io) if you haven't: `npm install -g pnpm`
2. Install dependencies: `pnpm install`
3. Copy `env.example` to `.env` and fill in the values.
4. Run `pnpm dev` and open `localhost:4321`.

## 🔐 Environment Variables

| Variable                    | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| `SITE_URL`                  | Site domain (default: `https://blog.eridev.asia/`)                 |
| `PUBLIC_SUPABASE_URL`       | Supabase project URL used by the comment system                    |
| `PUBLIC_SUPABASE_ANON_KEY`  | Supabase anon key used by the comment system                       |

On Vercel, set these in Project Settings → Environment Variables. Changing the domain only requires updating `SITE_URL` and redeploying.

## 📝 Writing Posts

Run `pnpm new-post <filename>` and edit the file in `src/content/posts/`.

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

## ⚡ Commands

| Command                    | Action                                           |
|:---------------------------|:-------------------------------------------------|
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`      |
| `pnpm build`               | Builds the production site to `./dist/`          |
| `pnpm preview`             | Previews the build locally                       |
| `pnpm check`               | Runs checks for errors in the code               |
| `pnpm format`              | Formats the code using Biome                     |
| `pnpm new-post <filename>` | Creates a new post                               |

## 🔄 Keep-alive

The Supabase free tier pauses after a period of inactivity. The `Keep Supabase Alive` GitHub Actions workflow queries the database periodically to prevent this. It requires the repository secrets `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.

## 🙏 Credits

Based on [Fuwari](https://github.com/saicaca/fuwari) by [saicaca](https://github.com/saicaca), licensed under the MIT License.

## 📄 License

This project is licensed under the MIT License.
