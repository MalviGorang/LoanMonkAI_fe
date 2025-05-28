import React from 'react';
import { Box, Container, Heading, VStack, HStack, Text, Circle, Divider } from '@chakra-ui/react';

const Step = ({ number, title, description }) => (
  <HStack spacing={4} align="start">
    <Circle 
      size="40px" 
      bg="teal.500" 
      color="white" 
      fontSize="lg" 
      fontWeight="bold"
    >
      {number}
    </Circle>
    <VStack align="start" spacing={2}>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  </HStack>
);

const HowItWorks = () => {
  const steps = [
    {
      title: 'Fill Your Profile',
      description: 'Complete your educational and financial details in our simple form'
    },
    {
      title: 'Get Matches',
      description: 'Our AI analyzes your profile to find the best matching lenders'
    },
    {
      title: 'Compare Options',
      description: 'Review and compare loan offers from multiple vendors'
    },
    {
      title: 'Apply Online',
      description: 'Submit your application directly through our platform'
    }
  ];

  return (
    <Box py={16}>
      <Container maxW="container.xl">
        <Heading 
          textAlign="center" 
          mb={12}
          bgGradient="linear(to-r, teal.500, blue.500)"
          bgClip="text"
        >
          How It Works
        </Heading>
        <VStack spacing={8}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <Step number={index + 1} {...step} />
              {index < steps.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default HowItWorks;
