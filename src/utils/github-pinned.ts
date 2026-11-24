export interface PinnedRepo {
	repo: string;
	description: string | null;
	language: string | null;
	stars: number;
	forks: number;
	license: string | null;
	avatar: string | null;
}

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

/**
 * Fetch the pinned repositories of a GitHub profile at build time.
 * Returns an empty array when the token is missing or the request fails.
 */
export async function getPinnedRepos(): Promise<PinnedRepo[]> {
	const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
	const login =
		import.meta.env.GITHUB_USERNAME ??
		process.env.GITHUB_USERNAME ??
		"trgianghuynh1808";

	if (!token) {
		console.warn("[github-pinned] GITHUB_TOKEN not set");
		return [];
	}

	try {
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
		if (json.errors) throw new Error(JSON.stringify(json.errors));
		const nodes = json?.data?.user?.pinnedItems?.nodes ?? [];
		return nodes
			.filter((n: { nameWithOwner?: string }) => n?.nameWithOwner)
			.map(
				(n: {
					nameWithOwner: string;
					description?: string;
					primaryLanguage?: { name: string };
					stargazerCount?: number;
					forkCount?: number;
					licenseInfo?: { spdxId: string };
					owner?: { avatarUrl: string };
				}) => ({
					repo: n.nameWithOwner,
					description: n.description ?? null,
					language: n.primaryLanguage?.name ?? null,
					stars: n.stargazerCount ?? 0,
					forks: n.forkCount ?? 0,
					license: n.licenseInfo?.spdxId ?? null,
					avatar: n.owner?.avatarUrl ?? null,
				}),
			);
	} catch (err) {
		console.warn(`[github-pinned] ${(err as Error).message}`);
		return [];
	}
}
