import React from 'react';
import { ChakraProvider, Box, Progress, useToast } from '@chakra-ui/react';
import { useStore } from './store/store';
import { LandingPage } from './components/landing';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
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

  const totalSteps = Object.keys(modals).length - 1; // Exclude dashboard
  const currentStep = Object.keys(modals).indexOf(currentModal);
  const progress = currentModal ? ((currentStep + 1) / totalSteps) * 100 : 0;

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
        <Box minH="100vh" bg="gray.50">
          {currentModal && <Progress value={progress} size="sm" colorScheme="teal" />}
          
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
