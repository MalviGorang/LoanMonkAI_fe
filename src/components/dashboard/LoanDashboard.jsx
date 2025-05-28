import React, { useState } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { generateDocumentList, matchVendors } from '../../api'; // Adjust the import based on your file structure

const LoanDashboard = ({ studentProfile }) => {
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [vendorMatches, setVendorMatches] = useState([]);

  const handleGenerateDocuments = async () => {
    try {
      setLoading(true);
      const response = await generateDocumentList(studentProfile);
      if (response) {
        setDocumentList(response);
      }
    } catch (error) {
      console.error('Error generating documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryVendorMatch = async () => {
    try {
      setLoading(true);
      const response = await matchVendors(studentProfile);
      if (response) {
        setVendorMatches(response);
      }
    } catch (error) {
      console.error('Error retrying vendor match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Loan Dashboard
      </Text>
      
      <HStack spacing={4} mt={4}>
        <Button
          colorScheme="blue"
          onClick={handleGenerateDocuments}
          isLoading={loading}
          loadingText="Generating..."
        >
          Generate Document List
        </Button>
        <Button
          colorScheme="green"
          onClick={handleRetryVendorMatch}
          isLoading={loading}
          loadingText="Retrying..."
        >
          Retry Vendor Match
        </Button>
      </HStack>

      {/* Render document list and vendor matches here */}
      <Box mt={6}>
        <Text fontSize="xl" mb={2}>
          Document List:
        </Text>
        <Box pl={4}>
          {documentList.length === 0 ? (
            <Text>No documents generated yet.</Text>
          ) : (
            documentList.map((doc, index) => (
              <Text key={index}>{doc}</Text>
            ))
          )}
        </Box>
      </Box>

      <Box mt={6}>
        <Text fontSize="xl" mb={2}>
          Vendor Matches:
        </Text>
        <Box pl={4}>
          {vendorMatches.length === 0 ? (
            <Text>No vendor matches found.</Text>
          ) : (
            vendorMatches.map((vendor, index) => (
              <Text key={index}>{vendor.vendor_name}</Text>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoanDashboard;