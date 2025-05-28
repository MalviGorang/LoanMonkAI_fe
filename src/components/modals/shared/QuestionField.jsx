import React from 'react';
import { FormControl, FormLabel, Input, Select, Box, Text } from '@chakra-ui/react';
import { QUESTION_DETAILS } from '../../../utils/constants';

const QuestionField = ({ 
  question, 
  value, 
  onChange, 
  error,
  profile,
  section 
}) => {
  const questionDetails = QUESTION_DETAILS[question];
  if (!questionDetails) return null;

  // Check conditions
  if (questionDetails.condition) {
    const shouldShow = evaluateCondition(questionDetails.condition, profile);
    if (!shouldShow) return null;
  }

  const renderField = () => {
    switch (questionDetails.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(question, e.target.value)}
            placeholder={questionDetails.text}
          />
        );

      case 'choice':
        return (
          <Select
            value={value || ''}
            onChange={(e) => onChange(question, e.target.value)}
            placeholder={questionDetails.text}
          >
            {questionDetails.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        );
      
      // Add other field types...

      default:
        return null;
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{questionDetails.text}</FormLabel>
      {renderField()}
      {questionDetails.explanation && (
        <Text fontSize="sm" color="gray.600" mt={1}>
          {questionDetails.explanation}
        </Text>
      )}
    </FormControl>
  );
};

export default QuestionField;
