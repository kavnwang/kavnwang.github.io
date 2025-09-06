/**
 * Edit this file or set OBSIDIAN_VAULT_PATH env var.
 * Only notes with `public: true` in frontmatter will be included.
 */
export default {
  vaultPaths: ["/Users/kevinwang/Obsidian"],
  ignorePatterns: [
    "**/.obsidian/**",
    "**/.trash/**",
    "**/Templates/**",
    "**/template/**",
    "**/node_modules/**"
  ],
  // Asset sync can use a looser ignore set than markdown building
  assetIgnorePatterns: [
    "**/.obsidian/**",
    "**/.trash/**",
    "**/node_modules/**"
  ],
  sectionTags: {
    blog: ["blog", "post"],
    likes: ["like", "likes", "fav", "favorite"],
    projects: ["project", "projects"]
  },
  requirePublicFlag: true
};
