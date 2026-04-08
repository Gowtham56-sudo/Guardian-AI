export type RecordingKind = 'video' | 'audio';

export interface RecordingItem {
  id: string;
  kind: RecordingKind;
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

export interface LocationItem {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'gps' | 'manual';
  createdAt: string;
}

const DB_NAME = 'guardian-admin-db';
const DB_VERSION = 1;
const RECORDINGS_STORE = 'recordings';
const LOCATIONS_STORE = 'locations';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(RECORDINGS_STORE)) {
        db.createObjectStore(RECORDINGS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(LOCATIONS_STORE)) {
        db.createObjectStore(LOCATIONS_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB.'));
  });

  return dbPromise;
}

function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  return getDb().then((db) => {
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = operation(store);

      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error ?? new Error('IndexedDB operation failed.'));
    });
  });
}

function withTransaction(storeName: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => void): Promise<void> {
  return getDb().then((db) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      action(store);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed.'));
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted.'));
    });
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const adminData = {
  async addRecording(kind: RecordingKind, blob: Blob, mimeType: string): Promise<RecordingItem> {
    const next: RecordingItem = {
      id: createId('rec'),
      kind,
      blob,
      mimeType,
      createdAt: new Date().toISOString(),
    };

    await withStore<IDBValidKey>(RECORDINGS_STORE, 'readwrite', (store) => store.put(next));
    return next;
  },

  async getRecordings(): Promise<RecordingItem[]> {
    const items = await withStore<RecordingItem[]>(RECORDINGS_STORE, 'readonly', (store) => store.getAll());
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async clearRecordings(): Promise<void> {
    await withStore<IDBValidKey>(RECORDINGS_STORE, 'readwrite', (store) => store.clear());
  },

  async addLocation(
    latitude: number,
    longitude: number,
    accuracy: number,
    source: 'gps' | 'manual' = 'gps'
  ): Promise<LocationItem> {
    const next: LocationItem = {
      id: createId('loc'),
      latitude,
      longitude,
      accuracy,
      source,
      createdAt: new Date().toISOString(),
    };

    await withStore<IDBValidKey>(LOCATIONS_STORE, 'readwrite', (store) => store.put(next));
    return next;
  },

  async getLocations(): Promise<LocationItem[]> {
    const items = await withStore<LocationItem[]>(LOCATIONS_STORE, 'readonly', (store) => store.getAll());
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async clearLocations(): Promise<void> {
    await withTransaction(LOCATIONS_STORE, 'readwrite', (store) => {
      store.clear();
    });
  },
};
