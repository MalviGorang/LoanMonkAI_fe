import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Text,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  useToast
} from '@chakra-ui/react';
import { useStore } from '../../store/store';

const BaseModal = ({ 
  title, 
  children, 
  onSubmit,
  onBack,
  submitText = 'Next', 
  isValid = true,
  showBackButton = true,
  skipText = null
}) => {
  const { isLoading, error, resetErrors } = useStore();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!isValid) {
      toast({
        title: "Form Error",
        description: "Please fix the errors before proceeding",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      resetErrors();
      await onSubmit();
    } catch (err) {
      // Error will be handled by the store's error state
      console.error("Form submission error:", err);
    }
  };

  const handleSkip = () => {
    if (typeof onSubmit === 'function') {
      onSubmit(true); // Pass true to indicate skipping
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={() => {}} 
      closeOnOverlayClick={false} 
      size="xl"
      aria-labelledby="modal-title"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent p={6}>
        <ModalHeader fontSize="2xl" color="teal.600" id="modal-title">
          {title}
        </ModalHeader>
        <ModalBody>
          {error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Box role="form" aria-label={`${title} form`}>
            {children}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Flex width="100%" justifyContent="space-between">
            <Box>
              {showBackButton && onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  colorScheme="teal"
                  isDisabled={isLoading}
                  aria-label="Go back to previous step"
                >
                  Back
                </Button>
              )}
            </Box>
            <Flex>
              {skipText && (
                <Button
                  mr={3}
                  variant="ghost"
                  onClick={handleSkip}
                  isDisabled={isLoading}
                  aria-label={`Skip ${title}`}
                >
                  {skipText}
                </Button>
              )}
              <Button
                colorScheme="teal"
                onClick={handleSubmit}
                isDisabled={!isValid || isLoading}
                minW="120px"
                aria-label={`Submit ${title}`}
              >
                {isLoading ? (
                  <Flex align="center">
                    <Spinner size="sm" mr={2} />
                    <Text>Processing...</Text>
                  </Flex>
                ) : submitText}
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;