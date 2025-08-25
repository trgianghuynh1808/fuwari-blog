import { siteConfig } from "@/config";

/**
 * Generate canonical URL for a given path
 * @param path - The path (e.g., "/posts/my-post/")
 * @param site - The site URL from Astro context
 * @returns The full canonical URL
 */
export function generateCanonicalUrl(path: string, site: URL | string): string {
	const siteUrl = typeof site === 'string' ? site : site.href;
	const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

	// Ensure path starts with / and ends with /
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	const finalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;

	return `${baseUrl}${finalPath}`;
}

/**
 * Generate structured data for blog posts
 * @param post - The post data
 * @param site - The site URL
 * @returns Structured data object
 */
export function generatePostStructuredData(post: any, site: URL | string) {
	const siteUrl = typeof site === 'string' ? site : site.href;

	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.data.title,
		description: post.data.description || post.data.title,
		image: post.data.image ? [new URL(post.data.image, siteUrl).href] : [],
		author: {
			"@type": "Person",
			name: siteConfig.title,
			url: siteUrl,
		},
		datePublished: post.data.published,
		dateModified: post.data.updated || post.data.published,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": new URL(`posts/${post.slug}/`, siteUrl).href
		},
		keywords: post.data.tags,
		inLanguage: post.data.lang
			? post.data.lang.replace("_", "-")
			: siteConfig.lang.replace("_", "-"),
		articleSection: post.data.category || "Uncategorized",
		publisher: {
			"@type": "Person",
			name: siteConfig.title,
			url: siteUrl,
		},
	};
}

/**
 * Generate hreflang tags for international SEO
 * @param canonicalUrl - The canonical URL
 * @param lang - The language code
 * @returns Array of hreflang link objects
 */
export function generateHreflangTags(canonicalUrl: string, lang: string) {
	return [
		{
			rel: "alternate",
			hreflang: "x-default",
			href: canonicalUrl
		},
		{
			rel: "alternate",
			hreflang: lang,
			href: canonicalUrl
		}
	];
}
