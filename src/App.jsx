import React from 'react';
import { ChakraProvider, Box, Progress, useToast, Button, IconButton } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { useStore } from './store/store';
import { LandingPage } from './components/landing';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { checkAndCleanupStorage, forceCleanupStorage, checkStorageIntegrity } from './utils/storageCleanup';
import { testStorage, simulateExpiration } from './utils/testStorage';
import {
  BasicInfoModal,
  EducationModal,
  StudyPlanModal,
  TestScoresModal,
  CollateralModal,
  IdentificationModal
} from './components/modals';

const modals = {
  basic_info: BasicInfoModal,
  education: EducationModal,
  study_plan: StudyPlanModal,
  tests: TestScoresModal,
  collateral: CollateralModal,
  identification: IdentificationModal,
  dashboard: Dashboard
};

const App = () => {
  const { currentModal, error } = useStore();
  const toast = useToast();
  const CurrentModal = modals[currentModal];
  const [showDevTools, setShowDevTools] = React.useState(false);

  const totalSteps = Object.keys(modals).length - 1; // Exclude dashboard
  const currentStep = Object.keys(modals).indexOf(currentModal);
  const progress = currentModal ? ((currentStep + 1) / totalSteps) * 100 : 0;
  // Clear session storage on page reload
  React.useEffect(() => {
    // This will run only on component mount (page load)
    const STORAGE_KEY_PREFIX = 'loan-assistant-storage';
    sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}-session`);
    
    // Check if persistent storage has expired (24 hour limit)
    const wasExpired = checkAndCleanupStorage();
    if (wasExpired) {
      console.log('Persistent storage was expired and has been cleared');
    } else {
      console.log('Persistent storage is still valid');
    }
    
    // Check storage integrity
    const integrityCheck = checkStorageIntegrity();
    console.log('Storage Integrity Check:', integrityCheck);
    
    // Log for debugging
    console.log('Session storage cleared on page load');
  }, []);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  }, [error, toast]);

  return (
    <ChakraProvider>
      <ErrorBoundary>
        <Box minH="100vh" bg="gray.50" position="relative">
          {currentModal && <Progress value={progress} size="sm" colorScheme="teal" />}
          
          {/* Developer Tools Button (only in development) */}
          {process.env.NODE_ENV !== 'production' && (
            <IconButton
              aria-label="Developer Tools"
              icon={<SettingsIcon />}
              position="fixed"
              bottom="20px"
              right="20px"
              colorScheme="gray"
              opacity="0.7"
              onClick={() => setShowDevTools(!showDevTools)}
              zIndex={1000}
            />
          )}
          
          {/* Developer Tools Panel */}
          {showDevTools && (
            <Box 
              position="fixed" 
              bottom="70px" 
              right="20px" 
              bg="white" 
              boxShadow="md" 
              p={4} 
              borderRadius="md"
              zIndex={1000}
              width="300px"
            >
              <Box fontSize="sm" fontWeight="bold" mb={3}>Developer Tools</Box>
              <Button 
                size="sm" 
                colorScheme="blue" 
                width="100%" 
                mb={2}
                onClick={() => {
                  testStorage();
                  toast({
                    title: "Storage Test",
                    description: "Test results in console",
                    status: "info",
                    duration: 3000,
                  });
                }}
              >
                Test Storage
              </Button>              <Button 
                size="sm" 
                colorScheme="orange" 
                width="100%"
                mb={2}
                onClick={() => {
                  simulateExpiration();
                  toast({
                    title: "Expiration Modified",
                    description: "Storage expiration set to 1 minute from now",
                    status: "warning",
                    duration: 3000,
                  });
                }}
              >
                Simulate Expiration (1min)
              </Button>
              <Button 
                size="sm" 
                colorScheme="red" 
                width="100%"
                onClick={() => {
                  forceCleanupStorage();
                  toast({
                    title: "Storage Cleared",
                    description: "All storage data has been forcefully cleared",
                    status: "error",
                    duration: 3000,
                  });
                }}
              >
                Force Clear Storage
              </Button>
            </Box>
          )}
          
          {!currentModal ? (
            <LandingPage />
          ) : (
            <Box p={4}>
              <CurrentModal />
            </Box>
          )}
        </Box>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;
