import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Box,
  Text,
  Progress,
  Button
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useStore } from '../../store/store';
import { getUploadUrl } from '../../services/api';

const structureDocuments = (documentList) => {
  console.log('Structuring documents:', documentList);
  
  if (!Array.isArray(documentList)) {
    console.error('documentList is not an array:', documentList);
    return [];
  }

  const sections = {
    'Student Documents': [],
    'Co-Applicant Documents': [],
    'Property Documents': []
  };

  let currentSection = '';

  documentList.forEach(item => {
    if (typeof item !== 'string') return;

    if (item.includes('Student Documents')) {
      currentSection = 'Student Documents';
    } else if (item.includes('Co-Applicant Documents')) {
      currentSection = 'Co-Applicant Documents';
    } else if (item.includes('Property Documents')) {
      currentSection = 'Property Documents';
    } else if (!item.includes(':')) {
      // Remove any numbers and colons from the document name
      const docName = item.replace(/^\d+\.\s*/, '').trim();
      if (currentSection && sections[currentSection]) {
        sections[currentSection].push({
          documentType: docName,
          section: currentSection
        });
      }
    }
  });

  const result = Object.entries(sections)
    .filter(([_, docs]) => docs.length > 0)
    .flatMap(([section, docs]) => docs);
    
  console.log('Structured result:', result);
  return result;
};

// Separate component for document row
const DocumentRow = ({ doc, onDrop, status }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: files => onDrop(files, doc.documentType),
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    }
  });

  return (
    <Tr>
      <Td>{doc.documentType}</Td>
      <Td>{doc.section}</Td>
      <Td>
        {status.completed ? 'Uploaded' : 
         status.error ? 'Failed' :
         status.uploading ? 'Uploading...' : 'Not Uploaded'}
      </Td>
      <Td>
        <Box
          {...getRootProps()}
          p={2}
          border="2px dashed"
          borderColor={status.completed ? "green.200" : "gray.200"}
          borderRadius="md"
          bg={status.completed ? "green.50" : "gray.50"}
          cursor="pointer"
          _hover={{ bg: status.completed ? "green.100" : "gray.100" }}
        >
          <input {...getInputProps()} />
          {status.uploading ? (
            <Progress size="sm" isIndeterminate />
          ) : (
            <Text fontSize="sm" textAlign="center">
              {status.completed ? "✓ Uploaded" : "Drop file or click"}
            </Text>
          )}
        </Box>
      </Td>
    </Tr>
  );
};

const DocumentUploadModal = ({ isOpen, onClose, documents = { document_list: [] } }) => {
  const toast = useToast();
  const { studentProfile } = useStore();
  const [uploadStatus, setUploadStatus] = React.useState({});

  const structuredDocuments = React.useMemo(() => {
    // Extract document_list from the API response
    const docList = Array.isArray(documents) ? documents : 
                   documents?.document_list || [];
    return structureDocuments(docList);
  }, [documents]);

  // Log structured documents for debugging
  React.useEffect(() => {
    console.log('Structured documents:', structuredDocuments);
  }, [structuredDocuments]);

  const handleDrop = React.useCallback(async (acceptedFiles, documentType) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus(prev => ({
      ...prev,
      [documentType]: { progress: 0, uploading: true }
    }));

    try {
      const { url } = await getUploadUrl(
        studentProfile.student_id,
        documentType,
        file.name
      );

      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      setUploadStatus(prev => ({
        ...prev,
        [documentType]: { progress: 100, uploading: false, completed: true }
      }));

      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(prev => ({
        ...prev,
        [documentType]: { progress: 0, uploading: false, error: true }
      }));
      
      toast({
        title: 'Upload Failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  }, [studentProfile.student_id, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          Upload Required Documents ({structuredDocuments.length})
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {structuredDocuments.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Document Type</Th>
                  <Th>Section</Th>
                  <Th>Status</Th>
                  <Th>Upload</Th>
                </Tr>
              </Thead>
              <Tbody>
                {structuredDocuments.map((doc, index) => (
                  <DocumentRow
                    key={`${doc.section}-${doc.documentType}-${index}`}
                    doc={doc}
                    onDrop={handleDrop}
                    status={uploadStatus[doc.documentType] || {}}
                  />
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text textAlign="center" py={4}>
              No documents available for upload. Please check the document list.
            </Text>
          )}
          <Button mt={4} colorScheme="blue" onClick={onClose}>
            Done
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DocumentUploadModal;
