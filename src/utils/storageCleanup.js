/**
 * Utility to check and clean up expired storage items
 */

const STORAGE_KEY_PREFIX = 'loan-assistant-storage';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Checks if the basic info and education storage has expired and cleans up if needed
 * @returns {boolean} True if data was expired and cleaned, false otherwise
 */
export const checkAndCleanupStorage = () => {
  const storedItem = localStorage.getItem(`${STORAGE_KEY_PREFIX}-persistent`);
  if (!storedItem) return false;
  
  try {
    const item = JSON.parse(storedItem);
    
    // If the item doesn't have an expiry timestamp, add one
    if (!item.expiry) {
      const now = new Date().getTime();
      item.expiry = now + TWENTY_FOUR_HOURS;
      localStorage.setItem(`${STORAGE_KEY_PREFIX}-persistent`, JSON.stringify(item));
      return false;
    }
    
    // Check if item has expired
    const now = new Date().getTime();
    if (item.expiry < now) {
      console.log('Storage data expired, cleaning up');
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}-persistent`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking storage expiration:', error);
    return false;
  }
};

/**
 * Updates the expiration time for the stored data
 */
export const refreshStorageExpiration = () => {
  const storedItem = localStorage.getItem(`${STORAGE_KEY_PREFIX}-persistent`);
  if (!storedItem) {
    // If no data exists yet, create a placeholder with basic structure
    const emptyState = {
      value: {
        studentProfile: {
          basic_info: {},
          education_details: {}
        }
      },
      expiry: new Date().getTime() + TWENTY_FOUR_HOURS
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-persistent`, JSON.stringify(emptyState));
    return;
  }
  
  try {
    const item = JSON.parse(storedItem);
    const now = new Date().getTime();
    item.expiry = now + TWENTY_FOUR_HOURS;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-persistent`, JSON.stringify(item));
    console.log('Storage expiration refreshed');
  } catch (error) {
    console.error('Error refreshing storage expiration:', error);
  }
};

/**
 * Force cleanup of all storage for testing purposes
 */
export const forceCleanupStorage = () => {
  const STORAGE_KEY_PREFIX = 'loan-assistant-storage';
  
  try {
    // Clear localStorage persistent data
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}-persistent`);
    
    // Clear sessionStorage data
    sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}-session`);
    
    console.log('All storage data has been forcefully cleared');
    return true;
  } catch (error) {
    console.error('Error during forced cleanup:', error);
    return false;
  }
};

/**
 * Checks if both Basic Info and Education data are present after storage restoration
 * @returns {Object} Status of persisted data
 */
export const checkStorageIntegrity = () => {
  const STORAGE_KEY_PREFIX = 'loan-assistant-storage';
  const persistentKey = `${STORAGE_KEY_PREFIX}-persistent`;
  const persistentData = localStorage.getItem(persistentKey);
  
  const result = {
    hasData: false,
    hasBasicInfo: false,
    hasEducationDetails: false,
    expiry: null
  };
  
  if (!persistentData) return result;
  
  try {
    const parsedData = JSON.parse(persistentData);
    result.hasData = true;
    
    if (parsedData.expiry) {
      result.expiry = new Date(parsedData.expiry);
    }
    
    if (
      parsedData.value && 
      parsedData.value.studentProfile && 
      parsedData.value.studentProfile.basic_info &&
      Object.keys(parsedData.value.studentProfile.basic_info).length > 0
    ) {
      result.hasBasicInfo = true;
    }
    
    if (
      parsedData.value && 
      parsedData.value.studentProfile && 
      parsedData.value.studentProfile.education_details &&
      Object.keys(parsedData.value.studentProfile.education_details).length > 0
    ) {
      result.hasEducationDetails = true;
    }
    
    return result;
  } catch (error) {
    console.error('Error checking storage integrity:', error);
    return result;
  }
};
