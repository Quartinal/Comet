type Suggestions = Promise<string | string[]>;

export async function fetchSuggestions(query: string): Suggestions {
  try {
    const res = await fetch(
      `https://corsproxy.io/?https://clients1.google.com/complete/search?output=toolbar&q=${encodeURIComponent(query)}`,
      {
        mode: "cors",
        method: "GET",
      },
    );
    if (!res.ok) throw Error(`Unable to find a match: ${res.statusText}`);
    const data = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/html");
    const suggestions: string[] = [];

    for (let i = 0; i < xmlDoc.getElementsByTagName("suggestion").length; i++) {
      suggestions.push(
        xmlDoc.getElementsByTagName("suggestion")[i].getAttribute("data"),
      );
    }
    return suggestions.slice(0, 8);
  } catch (error) {
    return console.error(error), [];
  }
}
