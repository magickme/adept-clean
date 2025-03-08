import { requestPersistentStorage, getStorageInfo } from './storageUtils';

/**
 * Initialize app features and permissions
 */
export async function initializeApp() {
  // Request persistent storage
  const persistentStorage = await requestPersistentStorage();
  if (persistentStorage) {
    // Get storage info for monitoring
    const { usage, quota } = await getStorageInfo();
    console.debug('Storage info:', {
      usage: Math.round(usage / 1024 / 1024) + 'MB',
      quota: Math.round(quota / 1024 / 1024) + 'MB',
      percentage: Math.round((usage / quota) * 100) + '%'
    });
  }
} 