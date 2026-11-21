import type { GameState } from "./types";

const DB_NAME = "scrap-kingdom-local";
const STORE = "saves";
const SLOT = "main";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local save storage."));
  });
}

export async function saveGame(state: GameState): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    transaction.objectStore(STORE).put(structuredClone(state), SLOT);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Save failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Save was cancelled."));
  });
  db.close();
}

export async function loadGame(): Promise<GameState | null> {
  const db = await openDatabase();
  const value = await new Promise<GameState | undefined>((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(SLOT);
    request.onsuccess = () => resolve(request.result as GameState | undefined);
    request.onerror = () => reject(request.error ?? new Error("Could not load save."));
  });
  db.close();
  return value ?? null;
}
