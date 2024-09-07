declare global {
  var settingsStorage: SettingsStorage;
  var importStorageData: typeof SettingsStorage.prototype.importStorageData;
  var exportStorageData: typeof SettingsStorage.prototype.exportStorageData;

  interface Window {
    settingsStorage: SettingsStorage;
  }

  interface Document {
    importStorageData: typeof SettingsStorage.prototype.importStorageData;
    exportStorageData: typeof SettingsStorage.prototype.exportStorageData;
  }
}

/**
 * extends the global storage class with data import and export functionality
 * @extends {Storage}
 */
export class SettingsStorage extends Storage {
  /**
   * imports storage data
   * @param file the file to import data from
   */
  importStorageData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        try {
          const jsonData = JSON.parse(fileReader.result as string);
          for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
              this.setItem(key, jsonData[key]);
            }
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      fileReader.readAsText(file);
    });
  }

  /** exports storage data */
  exportStorageData() {
    const jsonData = {};
    for (let i = 0; i < this.length; i++) {
      const key = this.key(i);
      jsonData[key] = this.getItem(key);
    }
    return new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });
  }

  /**
   * gets all the storage keys
   */
  getAllKeys() {
    const keys: string[] = [];
    for (let i = 0; i < this.length; i++) {
      keys.push(this.key(i));
    }
    return keys;
  }

  /**
   * checks if a certain key exists
   * @param key the key to check with
   */
  doesKeyExist(key: string) {
    return this.key(this.length - 1) === key;
  }

  /**
   * imports storage data from a json string
   * @param jsonData the json data to import
   */
  importStorageDataFromJSON(jsonData: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const data = JSON.parse(jsonData);
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            this.setItem(key, data[key]);
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * returns a (not literally) exported json string
   */
  exportStorageDataAsJSON() {
    const jsonData = {};
    for (let i = 0; i < this.length; i++) {
      const key = this.key(i);
      jsonData[key] = this.getItem(key);
    }
    return JSON.stringify(jsonData);
  }
}
