/** the ternary-based theme comparisons constant */
const themeComparisons = (theme: any) =>
  !theme
    ? "catppuccin-mocha"
    : theme === "kahoot"
      ? "kahoot-purple"
      : theme === "blooket"
        ? "blooket-blue"
        : "catppuccin-mocha";

export default themeComparisons;
export { themeComparisons };
