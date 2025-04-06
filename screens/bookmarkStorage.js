import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = 'BOOKMARKS_JOBS';

export const getBookmarks = async () => {
  const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
  return json ? JSON.parse(json) : [];
};

export const addBookmark = async (job) => {
  const bookmarks = await getBookmarks();
  const updated = [...bookmarks, job];
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
};

export const removeBookmark = async (jobId) => {
  const bookmarks = await getBookmarks();
  const updated = bookmarks.filter((job) => job.id !== jobId);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
};

export const isJobBookmarked = async (jobId) => {
  const bookmarks = await getBookmarks();
  return bookmarks.some((job) => job.id === jobId);
};

export const toggleBookmark = async (job) => {
  const isBookmarked = await isJobBookmarked(job.id);
  if (isBookmarked) {
    await removeBookmark(job.id);
  } else {
    await addBookmark(job);
  }
};
