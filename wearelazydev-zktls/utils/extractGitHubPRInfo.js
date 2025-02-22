export function extractGitHubPRInfo(url) {
  // Menghapus "https://github.com/" dari awal URL
  const withoutPrefix = url.replace("https://github.com/", "");

  // Memisahkan string berdasarkan '/'
  const parts = withoutPrefix.split("/");

  return {
    owner: parts[0],
    repo: parts[1],
    pull_number: parts[3],
  };
}
