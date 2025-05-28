import React from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8}>
          <VStack spacing={4}>
            <Text fontSize="xl" color="red.500">Something went wrong</Text>
            <Button 
              colorScheme="teal" 
              onClick={() => window.location.reload()}
            >
              Reload Application
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
