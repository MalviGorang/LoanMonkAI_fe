import React, { useState } from 'react';
import { Box, VStack, Heading, Grid, useToast, Button, HStack } from '@chakra-ui/react';
import { useStore } from '../store/store';
import { generateDocumentList } from '../services/api';
import DocumentUploader from './DocumentUploader';
import VendorMatches from './VendorMatches';
import LoanCalculator from './LoanCalculator';
import DocumentUploadModal from './modals/DocumentUploadModal'; // Updated import path

const Dashboard = () => {
  const { studentProfile, vendorMatches, documentList, setDocumentList, setCurrentModal } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const toast = useToast();

  const handleGenerateDocuments = async () => {
  try {
    setIsGenerating(true);
    const response = await generateDocumentList(studentProfile);
    console.log('API response in Dashboard:', response);
    if (response?.document_list) {
      let currentSection = '';
      const formattedDocs = response.document_list
        .filter(item => typeof item === 'string')
        .reduce((acc, item) => {
          if (item.endsWith(':')) {
            currentSection = item.slice(0, -1).trim();
            return acc;
          }
          if (item.match(/^\d+\./)) {
            const docName = item.replace(/^\d+\.\s*/, '').trim();
            acc.push({
              documentType: docName,
              section: currentSection,
              status: 'Not Uploaded',
              action: 'Upload'
            });
          }
          return acc;
        }, []);

      console.log('Formatted documents:', formattedDocs);
      setDocumentList(formattedDocs);
      setIsUploadModalOpen(true);
      toast({
        title: "Success",
        description: "Document list generated successfully",
        status: "success",
        duration: 3000
      });
    } else {
      throw new Error('No document list found in response');
    }
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to generate document list",
      status: "error",
      duration: 5000
    });
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <VStack spacing={8}>
        <Box w="full" display="flex" alignItems="center" justifyContent="space-between">
          <Heading>Your Loan Dashboard</Heading>
          <HStack spacing={4}>
            <Button 
              colorScheme="teal"
              onClick={handleGenerateDocuments}
              isLoading={isGenerating}
              loadingText="Generating..."
            >
              Generate Document List
            </Button>
            <Button colorScheme="blue" onClick={() => setCurrentModal('basic_info')}>
              Back
            </Button>
          </HStack>
        </Box>
        
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} w="full">
          <VStack spacing={6}>
            <VendorMatches matches={vendorMatches} />
            {documentList && documentList.length > 0 && (
              <DocumentUploader documents={documentList} />
            )}
          </VStack>
          
          <Box>
            <LoanCalculator />
          </Box>
        </Grid>

        <DocumentUploadModal 
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          documents={documentList || []}  // Pass directly without checking document_list
        />
      </VStack>
    </Box>
  );
};

export default Dashboard;