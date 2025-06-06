/**
 * Custom storage for Zustand persist middleware with different expiration strategies
 * - BasicInfo and Education: 24 hours cache
 * - Other data: Cleared on page reload (using sessionStorage)
 */

// Constants
const STORAGE_KEY_PREFIX = 'loan-assistant-storage';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Create a custom storage adapter
export const createCustomStorage = () => {
  // For basic_info and education_details: Use localStorage with 24-hour expiration
  const getWithExpiry = (key) => {
    const storedItem = localStorage.getItem(key);
    if (!storedItem) return null;
    
    try {
      const item = JSON.parse(storedItem);
      const now = new Date().getTime();
      
      // Check if item has expired
      if (item.expiry && item.expiry < now) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error parsing stored item:', error);
      return null;
    }
  };
  
  const setWithExpiry = (key, value) => {
    const now = new Date().getTime();
    const item = {
      value: value,
      expiry: now + TWENTY_FOUR_HOURS
    };
    localStorage.setItem(key, JSON.stringify(item));
  };
    // Return the custom storage adapter
  return {
    getItem: (name) => {
      try {
        // Get persistent data from localStorage (24-hour cache)
        const persistedState = getWithExpiry(`${STORAGE_KEY_PREFIX}-persistent`);
        
        // Get session data from sessionStorage (cleared on reload)
        const sessionState = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}-session`);
        const parsedSessionState = sessionState ? JSON.parse(sessionState) : {};
        
        // Construct the full state by combining both sources
        const state = {
          studentProfile: {
            // Default empty objects for all sections
            basic_info: {},
            education_details: {},
            loan_details: {},
            co_applicant_details: {},
            
            // Override with session data if available
            ...parsedSessionState.studentProfile,
            
            // Finally, override with persistent data for basic_info and education_details
            ...(persistedState && persistedState.studentProfile ? {
              basic_info: persistedState.studentProfile.basic_info || {},
              education_details: persistedState.studentProfile.education_details || {}
            } : {})
          },
          // Session-only data
          vendorMatches: parsedSessionState.vendorMatches || [],
          documentList: parsedSessionState.documentList || null,
          currentModal: parsedSessionState.currentModal || null
        };
        
        return JSON.stringify(state);
      } catch (error) {
        console.error('Error retrieving state:', error);
        return null;
      }
    },
    
    setItem: (name, value) => {
      try {
        const state = JSON.parse(value);
        
        // Store 24-hour cache items in localStorage
        if (state.studentProfile) {
          const persistentState = {
            studentProfile: {
              basic_info: state.studentProfile.basic_info || {},
              education_details: state.studentProfile.education_details || {}
            }
          };
          setWithExpiry(`${STORAGE_KEY_PREFIX}-persistent`, persistentState);
        }
        
        // Store all data in sessionStorage (will be cleared on reload)
        sessionStorage.setItem(`${STORAGE_KEY_PREFIX}-session`, JSON.stringify({
          studentProfile: state.studentProfile || {},
          vendorMatches: state.vendorMatches || [],
          documentList: state.documentList || null,
          currentModal: state.currentModal || null
        }));
      } catch (error) {
        console.error('Error setting state:', error);
      }
    },
    
    removeItem: (name) => {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}-persistent`);
      sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}-session`);
    }
  };
};
