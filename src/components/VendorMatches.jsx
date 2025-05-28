import React from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  Badge,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import { formatAmount } from '../utils/formatters';

const VendorMatches = ({ matches }) => {
  // Ensure matches is an array
  const matchesArray = Array.isArray(matches?.matches) ? matches.matches : [];

  const getBadgeColor = (matchType) => {
    switch (matchType) {
      case 'Best Match': return 'green';
      case 'Near Match': return 'yellow';
      default: return 'red';
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Matched Lenders</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {matchesArray.map((vendor, index) => (
          <Card key={index}>
            <CardHeader>
              <Stack direction="row" justify="space-between" align="center">
                <Heading size="md">{vendor.vendor_name}</Heading>
                <Badge colorScheme={getBadgeColor(vendor.match_type)}>
                  {vendor.match_type}
                </Badge>
              </Stack>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Text>
                  <strong>Match Score:</strong>{' '}
                  <Tooltip label={vendor.reason}>
                    <Badge colorScheme={vendor.score >= 80 ? 'green' : 'yellow'}>
                      {vendor.score}%
                    </Badge>
                  </Tooltip>
                </Text>
                <Divider />
                <Text><strong>Loan Amount:</strong> {formatAmount(vendor.adjusted_loan_amount_inr)}</Text>
                <Text><strong>Interest Rate:</strong> {vendor.interest_rate}</Text>
                <Text><strong>Tenure:</strong> {vendor.loan_tenor} years</Text>
                <Text><strong>Processing Fee:</strong> {vendor.processing_fee}</Text>
                <Text><strong>Moratorium:</strong> {vendor.moratorium_period}</Text>
                <Divider />
                <Text fontSize="sm" color="gray.600">
                  {vendor.foir_suggestion}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default VendorMatches;