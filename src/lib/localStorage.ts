/** an alias for the localstorage object */
export const storage = {
  /** sets the item */
  set: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  /** returns the item */
  get: (key: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
  },
  /** removes the item */
  remove: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};
