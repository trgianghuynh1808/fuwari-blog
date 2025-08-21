import { getSortedPosts, getCategoryList, getTagList } from "@utils/content-utils";
import { PAGE_SIZE } from "@constants/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	const site = context.site ?? "https://eri-journey-blog.vercel.app";
	const posts = await getSortedPosts();
	const categories = await getCategoryList();
	const tags = await getTagList();

	// Calculate total pages needed
	const totalPages = Math.ceil(posts.length / PAGE_SIZE);

	// Generate sitemap entries
	const sitemapEntries = [];

	// Priority levels:
	// 1.0 = Homepage (most important)
	// 0.8 = Main content pages (posts, about, archive)
	// 0.6 = Paginated pages (less important)

	// Change frequency:
	// daily = Homepage (updated frequently)
	// weekly = Archive and paginated pages
	// monthly = About page and blog posts

	// Helper function to ensure clean URLs without double slashes
	// Handles both string and URL object types, removes trailing slashes from base URL
	const cleanUrl = (path: string) => {
		const siteUrl = typeof site === 'string' ? site : site.href;
		const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
		const cleanPath = path.startsWith('/') ? path : `/${path}`;
		return `${baseUrl}${cleanPath}`;
	};

	// Homepage (highest priority)
	sitemapEntries.push({
		loc: cleanUrl(''),
		lastmod: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
		priority: "1.0",
		changefreq: "daily"
	});

	// About page
	sitemapEntries.push({
		loc: cleanUrl('about'),
		lastmod: new Date().toISOString().split('T')[0],
		priority: "0.8",
		changefreq: "monthly"
	});

	// Archive page
	sitemapEntries.push({
		loc: cleanUrl('archive'),
		lastmod: new Date().toISOString().split('T')[0],
		priority: "0.8",
		changefreq: "weekly"
	});

	// Blog posts (high priority for content)
	posts.forEach((post) => {
		sitemapEntries.push({
			loc: cleanUrl(`posts/${post.slug}/`),
			lastmod: post.data.updated
				? new Date(post.data.updated).toISOString().split('T')[0]
				: new Date(post.data.published).toISOString().split('T')[0],
			priority: "0.8",
			changefreq: "monthly"
		});
	});

	// Paginated pages (lower priority)
	for (let page = 2; page <= totalPages; page++) {
		sitemapEntries.push({
			loc: cleanUrl(page.toString()),
			lastmod: new Date().toISOString().split('T')[0],
			priority: "0.6",
			changefreq: "weekly"
		});
	}

	// Generate XML
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <priority>${entry.priority}</priority>
    <changefreq>${entry.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
		},
	});
}
