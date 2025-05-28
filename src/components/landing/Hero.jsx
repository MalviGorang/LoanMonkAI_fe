import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, Image } from '@chakra-ui/react';

const Hero = ({ onGetStarted }) => {
  return (
    <Container maxW="container.xl" py={16}>
      <Stack 
        direction={{ base: 'column', lg: 'row' }} 
        spacing={8} 
        align="center"
        justify="space-between"
      >
        <Box flex={1} maxW={{ lg: '50%' }}>
          <Heading 
            as="h1" 
            size="2xl" 
            mb={6}
            bgGradient="linear(to-r, teal.500, blue.500)"
            bgClip="text"
          >
            Find Your Perfect Student Loan Match
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={8}>
            Compare offers from multiple lenders, get AI-powered recommendations, 
            and find the best education loan for your studies abroad.
          </Text>
          <Button 
            size="lg" 
            colorScheme="teal"
            onClick={onGetStarted}
            px={8}
          >
            Get Started
          </Button>
        </Box>
        <Box flex={1} maxW={{ lg: '50%' }}>
          <Image 
            src="/hero-illustration.svg" 
            alt="Student Loan" 
            w="full"
            h="auto"
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default Hero;
