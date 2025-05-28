import React from 'react';
import { Box, VStack, Heading, Grid, useToast, Button } from '@chakra-ui/react';
import { useStore } from '../store/store';
import DocumentUploader from './DocumentUploader';
import VendorMatches from './VendorMatches';
import LoanCalculator from './LoanCalculator';

const Dashboard = () => {
  const { vendorMatches, documentList, setCurrentModal } = useStore();
  const toast = useToast();

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <VStack spacing={8}>
        <Box w="full" display="flex" alignItems="center" justifyContent="space-between">
          <Heading>Your Loan Dashboard</Heading>
          <Button colorScheme="blue" onClick={() => setCurrentModal('basic_info')}>
            Back
          </Button>
        </Box>
        
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} w="full">
          <VStack spacing={6}>
            <VendorMatches matches={vendorMatches} />
            <DocumentUploader documents={documentList} />
          </VStack>
          
          <Box>
            <LoanCalculator />
          </Box>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Dashboard;