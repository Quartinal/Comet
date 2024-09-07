import cx from "classix";
import { themeComparisons } from "~/lib/themeComparisons";
import { storage } from "~/lib/localStorage";

/** the themes class */
export class Themes {
  /** the theme name to use throughout this class */
  themeName?: string;

  /**
   * the themes class constructor
   * @param themeName the theme name to use throughout this class
   */
  constructor(themeName?: string) {
    this.themeName = themeName || "catppuccin-mocha";
  }

  /**
   * sets the theme name to use
   * @param themeName the theme name to set
   * @param classes the classes to set while setting the theme (required)
   */
  set(themeName?: string, ...classes: string[]) {
    storage.set("theme", themeName || "catppuccin-mocha");

    return cx(
      themeName !== "" && themeComparisons(themeName),
      "flex",
      ...(classes as any[]),
    );
  }

  /** returns the current theme name */
  get(): string {
    return storage.get("theme");
  }
}
