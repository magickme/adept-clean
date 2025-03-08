/**
 * Request persistent storage using modern navigator.storage API
 * @returns Promise<boolean> - Whether persistent storage was granted
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    // Check if the Storage API is supported
    if (!navigator?.storage?.persist) {
      console.warn('Storage API not supported');
      return false;
    }

    // Check if persistence is already granted
    const isPersisted = await navigator.storage.persisted();
    if (isPersisted) {
      return true;
    }

    // Request persistence
    const granted = await navigator.storage.persist();
    return granted;
  } catch (error) {
    console.error('Error requesting persistent storage:', error);
    return false;
  }
}

/**
 * Get storage usage and quota information
 * @returns Promise<{usage: number, quota: number}> - Storage usage info in bytes
 */
export async function getStorageInfo(): Promise<{ usage: number; quota: number }> {
  try {
    if (!navigator?.storage?.estimate) {
      return { usage: 0, quota: 0 };
    }

    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { usage: 0, quota: 0 };
  }
} 