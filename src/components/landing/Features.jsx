import React from 'react';
import { Container, SimpleGrid, Box, Icon, Heading, Text } from '@chakra-ui/react';
import { SearchIcon, CopyIcon, TriangleUpIcon, StarIcon } from '@chakra-ui/icons';

const FeatureCard = ({ icon, title, description }) => (
  <Box 
    p={8} 
    bg="white" 
    borderRadius="lg" 
    boxShadow="lg"
    transition="transform 0.2s"
    _hover={{ transform: 'translateY(-5px)' }}
  >
    <Icon as={icon} w={10} h={10} color="teal.500" mb={4} />
    <Heading size="md" mb={4}>{title}</Heading>
    <Text color="gray.600">{description}</Text>
  </Box>
);

const Features = () => {
  const features = [
    {
      icon: SearchIcon,
      title: 'Smart Matching',
      description: 'AI-powered vendor matching based on your profile and preferences'
    },
    {
      icon: CopyIcon,
      title: 'Document Checklist',
      description: 'Personalized document requirements list for your application'
    },
    {
      icon: TriangleUpIcon,  // Changed from DollarSign to TriangleUpIcon
      title: 'Loan Comparison',
      description: 'Compare interest rates, terms, and conditions across lenders'
    },
    {
      icon: StarIcon,
      title: 'EMI Calculator',
      description: 'Calculate your monthly payments and total repayment amount'
    }
  ];

  return (
    <Box bg="gray.50" py={16}>
      <Container maxW="container.xl">
        <Heading 
          textAlign="center" 
          mb={12}
          bgGradient="linear(to-r, teal.500, blue.500)"
          bgClip="text"
        >
          Why Choose Us
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Features;
