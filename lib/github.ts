export const getUserUrl = (username: string) =>
  `https://api.github.com/users/${username}`;

export const getReposUrl = (username: string) =>
  `${getUserUrl(username)}/repos?per_page=100`;

export async function fetchUserStats(username: string) {
  const response = await fetch(getReposUrl(username));

  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }

  const repos = await response.json();

  const stats = {
    stars: 0,
    forks: 0,
    repos: repos.length,
  };

  const languageMap = new Map();
  let totalSize = 0;

  for (const repo of repos) {
    stats.stars += repo.stargazers_count;
    stats.forks += repo.forks_count;

    if (repo.language) {
      const currentSize = languageMap.get(repo.language) || 0;
      languageMap.set(repo.language, currentSize + repo.size);
      totalSize += repo.size;
    }
  }

  const languageColors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    Ruby: "#701516",
    PHP: "#4F5D95",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
  };

  const languages = Array.from(languageMap.entries())
    .map(([name, size]) => ({
      name,
      percentage: (size / totalSize) * 100,
      color: languageColors[name] || "#8B8B8B",
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  return { stats, languages };
}
