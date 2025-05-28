import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Input, 
  Button, 
  Text,
  Badge,
  useToast,
  Progress,
  Heading
} from '@chakra-ui/react';
import { useStore } from '../store/store';
import { getUploadUrl } from '../services/api';

const DocumentUploader = ({ documents }) => {
  // Format the document list into sections and items
  const processDocumentList = (docString) => {
    if (typeof docString !== 'string') return [];
    
    const lines = docString.split('\n');
    let currentSection = '';
    const formattedDocs = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.endsWith(':') || line.endsWith(' (PDF):')) {
        currentSection = line.replace(':', '');
      } else if (line.match(/^\d+\./)) {
        // Remove number and trim
        const docName = line.replace(/^\d+\./, '').trim();
        formattedDocs.push({
          name: docName,
          section: currentSection,
          status: 'Not Uploaded'
        });
      }
    });

    return formattedDocs;
  };

  const documentList = processDocumentList(documents);
  const { studentProfile } = useStore();
  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const toast = useToast();

  const handleUpload = async (documentType, file) => {
    if (!file || !studentProfile.student_id) return;

    setUploading(prev => ({ ...prev, [documentType]: true }));
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));

    try {
      // Get pre-signed URL
      const { url } = await getUploadUrl(
        studentProfile.student_id,
        documentType.replace(/\s/g, '_'),
        file.name
      );

      // Upload file with progress tracking
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(prev => ({ ...prev, [documentType]: progress }));
        }
      });

      toast({
        title: 'Upload Success',
        description: `${file.name} uploaded successfully`,
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Required Documents</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Document Type</Th>
            <Th>Section</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documentList.map((doc, index) => (
            <Tr key={index}>
              <Td>{doc.name}</Td>
              <Td>
                <Text fontSize="sm" color="gray.600">
                  {doc.section}
                </Text>
              </Td>
              <Td>
                <Badge 
                  colorScheme={uploading[doc.name] ? 'yellow' : doc.status === 'Uploaded' ? 'green' : 'red'}
                >
                  {uploading[doc.name] ? 'Uploading...' : doc.status}
                </Badge>
              </Td>
              <Td>
                {uploadProgress[doc.name] > 0 && uploadProgress[doc.name] < 100 ? (
                  <Progress value={uploadProgress[doc.name]} size="sm" />
                ) : (
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleUpload(doc.name, e.target.files[0])}
                    disabled={uploading[doc.name]}
                    size="sm"
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DocumentUploader;