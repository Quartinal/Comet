import { storage } from "./localStorage";
import { Proxies } from "./encodeURL";
import { encodeRammerhead } from "./encodeRammerhead";
/**
 * initializes the browser
 */
export function InitBrowser() {
  const sw = new Proxies();

  const area = document.querySelector(".browse-section") as HTMLDivElement;

  const iframe = area.querySelectorAll("iframe")[0];
  const input = document.querySelector(".url-input") as HTMLInputElement;

  input.oninput = e => {
    //@ts-ignore
    const value = e.target.value;
    const proxy = storage.get("proxy");

    input.onkeydown = async e => {
      switch (e.key) {
        case "Enter":
          iframe.style.setProperty("display", "flex");

          if (localStorage.getItem("open-in-new")) {
            const p = prompt(
              "bare-mux currently has a bug related to redirects.\n\nAre you sure you want to continue [y/n]?",
            );

            switch (p) {
              case "":
                alert("Please enter a valid answer.");
                break;
              case "yes":
                if (
                  value.startsWith("http://") ||
                  value.startsWith("https://")
                ) {
                  if (proxy === "rammerhead") {
                    window.location.href =
                      origin + (await encodeRammerhead(value));
                  } else if (proxy === "meteor") {
                    window.location.href =
                      origin + (await sw.encodeMeteor(value));
                  } else if (storage.get("proxy") === "scramjet") {
                    window.location.href =
                      origin + (await sw.encodeScramjet(value));
                  } else {
                    window.location.href =
                      origin + (await sw.encodeUltraviolet(value));
                  }
                } else {
                  if (proxy === "rammerhead") {
                    window.location.href =
                      origin +
                      (await encodeRammerhead(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else if (proxy === "ultraviolet") {
                    window.location.href =
                      origin +
                      (await sw.encodeUltraviolet(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else if (proxy === "meteor") {
                    window.location.href =
                      origin +
                      (await sw.encodeMeteor(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else if (storage.get("proxy") === "scramjet") {
                    window.location.href =
                      origin +
                      (await sw.encodeScramjet(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else {
                    window.location.href =
                      origin +
                      (await sw.encodeUltraviolet(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  }
                }
                break;
              default:
                if (
                  value.startsWith("http://") ||
                  value.startsWith("https://")
                ) {
                  if (proxy === "rammerhead") {
                    iframe.contentWindow.location.href =
                      origin + (await encodeRammerhead(value));
                  } else if (proxy === "meteor") {
                    iframe.contentWindow.location.href =
                      origin + (await sw.encodeMeteor(value));
                  } else if (storage.get("proxy") === "scramjet") {
                    iframe.contentWindow.location.href =
                      origin + (await sw.encodeScramjet(value));
                  } else {
                    iframe.contentWindow.location.href =
                      origin + (await sw.encodeUltraviolet(value));
                  }
                } else {
                  if (proxy === "rammerhead") {
                    iframe.contentWindow.location.href =
                      origin +
                      (await encodeRammerhead(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else if (proxy === "ultraviolet") {
                    iframe.contentWindow.location.href =
                      origin +
                      (await sw.encodeUltraviolet(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else if (proxy === "meteor") {
                    iframe.contentWindow.location.href =
                      origin +
                      (await sw.encodeMeteor(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else if (storage.get("proxy") === "scramjet") {
                    iframe.contentWindow.location.href =
                      origin +
                      (await sw.encodeScramjet(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  } else {
                    iframe.contentWindow.location.href =
                      origin +
                      (await sw.encodeUltraviolet(
                        "https://www.google.com/search?q=%s".replace(
                          "%s",
                          value,
                        ),
                      ));
                  }
                }
                break;
            }
          }

          if (value.startsWith("http://") || value.startsWith("https://")) {
            if (proxy === "rammerhead") {
              iframe.contentWindow.location.href =
                origin + (await encodeRammerhead(value));
            } else if (proxy === "meteor") {
              iframe.contentWindow.location.href =
                origin + (await sw.encodeMeteor(value));
            } else if (storage.get("proxy") === "scramjet") {
              iframe.contentWindow.location.href =
                origin + (await sw.encodeScramjet(value));
            } else {
              iframe.contentWindow.location.href =
                origin + (await sw.encodeUltraviolet(value));
            }
          } else {
            if (proxy === "rammerhead") {
              iframe.contentWindow.location.href =
                origin +
                (await encodeRammerhead(
                  "https://www.google.com/search?q=%s".replace("%s", value),
                ));
            } else if (proxy === "ultraviolet") {
              iframe.contentWindow.location.href =
                origin +
                (await sw.encodeUltraviolet(
                  "https://www.google.com/search?q=%s".replace("%s", value),
                ));
            } else if (proxy === "meteor") {
              iframe.contentWindow.location.href =
                origin +
                (await sw.encodeMeteor(
                  "https://www.google.com/search?q=%s".replace("%s", value),
                ));
            } else if (storage.get("proxy") === "scramjet") {
              iframe.contentWindow.location.href =
                origin +
                (await sw.encodeScramjet(
                  "https://www.google.com/search?q=%s".replace("%s", value),
                ));
            } else {
              iframe.contentWindow.location.href =
                origin +
                (await sw.encodeUltraviolet(
                  "https://www.google.com/search?q=%s".replace("%s", value),
                ));
            }
          }
          break;
      }
    };
  };
}
