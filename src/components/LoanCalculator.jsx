import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Divider,
  useToast
} from '@chakra-ui/react';

const LoanCalculator = () => {
  const [formData, setFormData] = useState({
    amount: '',
    rate: '',
    tenure: '',
    type: 'simple'
  });
  const [result, setResult] = useState(null);
  const toast = useToast();

  const calculateEMI = () => {
    const { amount, rate, tenure, type } = formData;
    if (!amount || !rate || !tenure) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        status: "warning",
        duration: 3000
      });
      return;
    }

    const p = parseFloat(amount);
    const r = parseFloat(rate) / 1200; // monthly interest rate
    const n = parseFloat(tenure) * 12; // months

    let emi, totalInterest;
    if (type === 'simple') {
      totalInterest = p * (parseFloat(rate)/100) * parseFloat(tenure);
      emi = (p + totalInterest) / n;
    } else {
      emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      totalInterest = (emi * n) - p;
    }

    setResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: (p + totalInterest).toFixed(2)
    });
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">Loan Calculator</Text>
        <FormControl>
          <FormLabel>Loan Amount</FormLabel>
          <Input 
            type="number" 
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Interest Rate (%)</FormLabel>
          <Input 
            type="number" 
            value={formData.rate}
            onChange={(e) => setFormData({...formData, rate: e.target.value})}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tenure (Years)</FormLabel>
          <Input 
            type="number" 
            value={formData.tenure}
            onChange={(e) => setFormData({...formData, tenure: e.target.value})}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Interest Type</FormLabel>
          <Select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="simple">Simple Interest</option>
            <option value="compound">Compound Interest</option>
          </Select>
        </FormControl>
        <Button colorScheme="teal" onClick={calculateEMI}>Calculate EMI</Button>
        
        {result && (
          <Box w="100%" pt={4}>
            <Divider mb={4} />
            <VStack align="stretch" spacing={2}>
              <Text><strong>Monthly EMI:</strong> ₹{result.emi}</Text>
              <Text><strong>Total Interest:</strong> ₹{result.totalInterest}</Text>
              <Text><strong>Total Payment:</strong> ₹{result.totalPayment}</Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default LoanCalculator;
