/**
 * A simple utility to test the storage implementation
 * Run this in the browser console to verify storage behavior
 */

// Constants
const STORAGE_KEY_PREFIX = 'loan-assistant-storage';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Test the storage implementation
 */
const testStorage = () => {
  console.group('Storage Test');
  
  // Test persistent storage (localStorage with expiry)
  console.log('Testing persistent storage (24-hour cache)...');
  const persistentKey = `${STORAGE_KEY_PREFIX}-persistent`;
  const persistentData = localStorage.getItem(persistentKey);
  
  if (persistentData) {
    try {
      const parsedData = JSON.parse(persistentData);
      console.log('Persistent data found:', parsedData);
      
      // Check expiration
      if (parsedData.expiry) {
        const now = new Date().getTime();
        const expiryDate = new Date(parsedData.expiry);
        const timeLeft = parsedData.expiry - now;
        
        console.log(`Expiration: ${expiryDate.toLocaleString()}`);
        console.log(`Time remaining: ${Math.floor(timeLeft / (60 * 60 * 1000))} hours ${Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))} minutes`);
        
        if (timeLeft <= 0) {
          console.warn('Data has expired but was not cleaned up!');
        }
      } else {
        console.warn('No expiry time found on persistent data!');
      }
      
      // Check contents
      if (parsedData.value && parsedData.value.studentProfile) {
        console.log('Basic info:', parsedData.value.studentProfile.basic_info || 'Empty');
        console.log('Education details:', parsedData.value.studentProfile.education_details || 'Empty');
      } else {
        console.warn('Persistent data structure is not as expected!');
      }
    } catch (error) {
      console.error('Error parsing persistent data:', error);
    }
  } else {
    console.log('No persistent data found');
  }
  
  // Test session storage
  console.log('\nTesting session storage...');
  const sessionKey = `${STORAGE_KEY_PREFIX}-session`;
  const sessionData = sessionStorage.getItem(sessionKey);
  
  if (sessionData) {
    try {
      const parsedData = JSON.parse(sessionData);
      console.log('Session data found:', parsedData);
      
      // Check which modals have data
      const modals = ['basic_info', 'education_details', 'loan_details', 'co_applicant_details'];
      modals.forEach(modal => {
        if (parsedData.studentProfile && parsedData.studentProfile[modal]) {
          const isEmpty = Object.keys(parsedData.studentProfile[modal]).length === 0;
          console.log(`${modal}: ${isEmpty ? 'Empty' : 'Has Data'}`);
        } else {
          console.log(`${modal}: Not Found`);
        }
      });
    } catch (error) {
      console.error('Error parsing session data:', error);
    }
  } else {
    console.log('No session data found (expected after page reload)');
  }
  
  console.groupEnd();
  
  return 'Storage test complete. Check console for results.';
};

/**
 * Simulate storage expiration for testing
 */
const simulateExpiration = () => {
  const persistentKey = `${STORAGE_KEY_PREFIX}-persistent`;
  const persistentData = localStorage.getItem(persistentKey);
  
  if (persistentData) {
    try {
      const parsedData = JSON.parse(persistentData);
      // Set expiry to 1 minute from now
      parsedData.expiry = new Date().getTime() + (1 * 60 * 1000);
      localStorage.setItem(persistentKey, JSON.stringify(parsedData));
      console.log('Storage expiration set to 1 minute from now. Reload page after that to test cleanup.');
    } catch (error) {
      console.error('Error modifying expiration:', error);
    }
  } else {
    console.log('No persistent data found to modify');
  }
};

// Usage examples
// testStorage() - Run this to check current storage state
// simulateExpiration() - Run this to set expiry to 1 minute for testing cleanup

// Export for module usage
export { testStorage, simulateExpiration };
