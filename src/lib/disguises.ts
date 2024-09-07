import { storage } from "./localStorage";

/** the base disguises class */
export class Disguises {
  url?: URL;

  /**
   * accepts a url as an optional argument
   * @param url the url to use when creating a new url object
   */
  constructor(url?: string) {
    this.url = new URL(url) || new URL(String(location));
  }

  /**
   * accepts a parameter as an argument
   * @param param the parameter to get the value of (required)
   */
  #getSearchParams(param: string) {
    return this.url.searchParams.get(param);
  }

  /**
   * the disguises list method
   */
  disguisesList() {
    return ["canvas", "classlink"];
  }

  /**
   * returns a random item from disguisesList
   */
  chooseRandom() {
    return this.disguisesList()[
      Math.floor(Math.random() * this.disguisesList().length)
    ];
  }

  /**
   * essentially the main method of this class
   */
  init() {
    const param = "disguise";
    const paramValue = this.#getSearchParams(param);
    const list = this.disguisesList();

    switch (paramValue) {
      case list[0]:
        storage.set("disguise", "canvas");
        break;
      case list[1]:
        storage.set("disguise", "classlink");
        break;
      case "random":
        const randomValue = this.chooseRandom();
        storage.set("disguise", randomValue);
        break;
    }
  }
}
