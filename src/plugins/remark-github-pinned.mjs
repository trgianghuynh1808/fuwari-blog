import { visit } from "unist-util-visit";

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          nameWithOwner
          description
          stargazerCount
          forkCount
          primaryLanguage { name }
          licenseInfo { spdxId }
          owner { avatarUrl }
        }
      }
    }
  }
}`;

async function fetchPinnedRepos(login, token) {
	const res = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query: QUERY, variables: { login } }),
		signal: AbortSignal.timeout(10000),
	});
	if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
	const json = await res.json();
	const nodes = json?.data?.user?.pinnedItems?.nodes ?? [];
	return nodes
		.filter((n) => n?.nameWithOwner)
		.map((n) => ({
			repo: n.nameWithOwner,
			// Prefetched at build time so visitors don't hit the unauthenticated GitHub API
			data: {
				description: n.description ?? null,
				language: n.primaryLanguage?.name ?? null,
				stars: n.stargazerCount ?? 0,
				forks: n.forkCount ?? 0,
				license: n.licenseInfo?.spdxId ?? null,
				avatar: n.owner?.avatarUrl ?? null,
			},
		}));
}

/**
 * Replaces `::github-pinned{fallback="owner/a,owner/b"}` with one
 * `::github{repo="..."}` card per pinned repository of the GitHub profile.
 * Falls back to the `fallback` attribute when the token is missing or the API fails.
 */
export function remarkGithubPinned() {
	return async (tree) => {
		const targets = [];
		visit(tree, "leafDirective", (node, index, parent) => {
			if (node.name === "github-pinned") targets.push({ node, index, parent });
		});
		if (targets.length === 0) return;

		const token = process.env.GITHUB_TOKEN;
		const login = process.env.GITHUB_USERNAME || "trgianghuynh1808";

		let pinned = [];
		if (token) {
			try {
				pinned = await fetchPinnedRepos(login, token);
			} catch (err) {
				console.warn(`[github-pinned] ${err.message}, using fallback list`);
			}
		} else {
			console.warn("[github-pinned] GITHUB_TOKEN not set, using fallback list");
		}

		// Process from the end so earlier indexes stay valid
		for (const { node, parent } of targets.reverse()) {
			const fallback = (node.attributes?.fallback ?? "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			const repos =
				pinned.length > 0
					? pinned
					: fallback.map((repo) => ({ repo, data: null }));
			const cards = repos.map(({ repo, data }) => ({
				type: "leafDirective",
				name: "github",
				attributes: data ? { repo, data: JSON.stringify(data) } : { repo },
				children: [],
			}));
			const i = parent.children.indexOf(node);
			parent.children.splice(i, 1, ...cards);
		}
	};
}
