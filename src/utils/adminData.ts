export type RecordingKind = 'video' | 'audio';

export interface RecordingItem {
  id: string;
  kind: RecordingKind;
  url: string;
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

const RECORDINGS_KEY = 'guardian-admin-recordings';
const LOCATIONS_KEY = 'guardian-admin-locations';

function safeRead<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const adminData = {
  addRecording(kind: RecordingKind, url: string, mimeType: string): RecordingItem {
    const next: RecordingItem = {
      id: createId('rec'),
      kind,
      url,
      mimeType,
      createdAt: new Date().toISOString(),
    };
    const items = this.getRecordings();
    items.unshift(next);
    writeList(RECORDINGS_KEY, items);
    return next;
  },

  getRecordings(): RecordingItem[] {
    return safeRead<RecordingItem>(RECORDINGS_KEY);
  },

  clearRecordings(): void {
    writeList(RECORDINGS_KEY, []);
  },

  addLocation(
    latitude: number,
    longitude: number,
    accuracy: number,
    source: 'gps' | 'manual' = 'gps'
  ): LocationItem {
    const next: LocationItem = {
      id: createId('loc'),
      latitude,
      longitude,
      accuracy,
      source,
      createdAt: new Date().toISOString(),
    };
    const items = this.getLocations();
    items.unshift(next);
    writeList(LOCATIONS_KEY, items);
    return next;
  },

  getLocations(): LocationItem[] {
    return safeRead<LocationItem>(LOCATIONS_KEY);
  },

  clearLocations(): void {
    writeList(LOCATIONS_KEY, []);
  },
};
