import { openDB } from 'idb';

const DB_NAME = "jobBookmarks";
const STORE_NAME = "bookmarkedJobs";

// Open IndexedDB
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

// Add a job to bookmarks
export async function addBookmark(job) {
  const db = await dbPromise;
  await db.put(STORE_NAME, job);
}

// Get all bookmarked jobs
export async function getBookmarks() {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}

// Remove a bookmark by job ID
export async function removeBookmark(jobId) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, jobId);
}

// Check if a job is bookmarked
export async function isBookmarked(jobId) {
  const db = await dbPromise;
  return await db.get(STORE_NAME, jobId);
}
