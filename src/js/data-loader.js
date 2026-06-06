export class DataLoader {
    static async loadJSON(url) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load JSON: ${url}`);
      return await res.json();
    }
  }