import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageStoreService {
  private readonly dbName = 'food-fetish-images-db';
  private readonly storeName = 'images';
  private readonly dbVersion = 1;
  private readonly cache = new Map<string, string>();

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'imageId' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(imageId: string, base: string): Promise<string> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const base64 = `data:image/jpeg;base64,${base}`;
      tx.objectStore(this.storeName).put({ imageId, base64 });
      tx.oncomplete = () => {
        this.cache.set(imageId, base64);
        resolve(base64);
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(imageId: string): Promise<string | null> {
    const cached = this.cache.get(imageId);
    if (cached !== undefined) {
      return cached;
    }

    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const request = tx.objectStore(this.storeName).get(imageId);
      request.onsuccess = () => {
        const result = request.result as { imageId: string; base64: string } | undefined;
        if (result) {
          this.cache.set(imageId, result.base64);
          resolve(result.base64);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDatabase(): Promise<void> {
    this.cache.clear();
    const db = await this.openDb();
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).clear();
    await new Promise((resolve) => {
      tx.oncomplete = () => resolve(void 0);
    });
  }

  async delete(imageId: string): Promise<void> {
    const db = await this.openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).delete(imageId);
      tx.oncomplete = () => {
        this.cache.delete(imageId);
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }
}
