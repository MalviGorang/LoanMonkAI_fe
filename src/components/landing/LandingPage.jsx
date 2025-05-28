import React from 'react';
import { Box } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';

const LandingPage = () => {
  const { setCurrentModal } = useStore();

  const handleGetStarted = () => {
    setCurrentModal('basic_info');
  };

  return (
    <Box>
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <HowItWorks />
    </Box>
  );
};

export default LandingPage;
