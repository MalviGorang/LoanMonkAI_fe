import React, { useEffect, useCallback } from 'react';
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
  Flex
} from '@chakra-ui/react';
import { useStore } from '../../store/store';

const BaseModal = ({ 
  title, 
  children, 
  onSubmit, 
  onBack,
  submitText = 'Next', 
  isValid = true,
  backText = 'Back'
}) => {
  const { isLoading } = useStore();
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    // Submit form on Enter key if valid and not loading
    if (event.key === 'Enter' && isValid && !isLoading) {
      onSubmit();
    }
    // Go back on Escape key if onBack function is provided
    else if (event.key === 'Escape' && onBack) {
      onBack();
    }
  }, [onSubmit, onBack, isValid, isLoading]);
  
  // Add and remove global keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Modal 
      isOpen={true} 
      onClose={() => {}} 
      closeOnOverlayClick={false}
      size="xl"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent p={6}>
        <ModalHeader 
          fontSize="2xl"
          color="teal.600"
          borderBottom="2px solid"
          borderColor="teal.100"
          pb={4}
        >
          {title}
        </ModalHeader>
        
        <ModalBody py={6}>
          {children}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={onSubmit}
            isDisabled={!isValid || isLoading}
            minW="120px"
          >
            {isLoading ? (
              <Flex align="center">
                <Spinner size="sm" mr={2} />
                <Text>Processing...</Text>
              </Flex>
            ) : submitText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;
