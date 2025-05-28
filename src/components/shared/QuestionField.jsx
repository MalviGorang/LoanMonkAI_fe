import React from 'react';
import { 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
} from '@chakra-ui/react';
import { QUESTION_DETAILS } from '../../utils/constants';
import {
  TextField,
  ChoiceField,
  ScoreFormatCombo,
  TestScoreCombo,
  AmountCurrencyField,
  CourseDurationField
} from './FormFieldTypes';

const QuestionField = ({ 
  question,
  value,
  onChange,
  error,
  setError,
  profile = {},
  section,
  additionalData = {},
  isRequired = false
}) => {
  const questionDetails = QUESTION_DETAILS[question];
  if (!questionDetails) return null;

  const handleChange = (newValue) => {
    if (typeof onChange === 'function') {
      onChange(newValue);
      if (setError) setError(null);
    }
  };

  // Check conditions
  if (questionDetails.condition) {
    try {
      const conditions = questionDetails.condition.split('&&').map(c => c.trim());
      const shouldShow = conditions.every(condition => {
        if (condition.includes('==')) {
          const [field, val] = condition.split('==').map(s => s.trim());
          return profile[field] === val.replace(/['\"]/g, '');
        } else if (condition.includes('!=')) {
          const [field, val] = condition.split('!=').map(s => s.trim());
          return profile[field] !== val.replace(/['\"]/g, '');
        } else if (condition.includes('in')) {
          const [field, values] = condition.split('in').map(s => s.trim());
          const valueList = values.replace(/[\[\]'\"]/g, '').split(',').map(s => s.trim());
          return !valueList.includes(profile[field]);
        }
        return true;
      });

      if (!shouldShow) return null;
      
      // Debug logging
      console.log(`Showing field ${question}, profile:`, profile);
    } catch (err) {
      console.warn(`Condition evaluation failed for ${question}:`, err);
    }
  }

  // Special handling for specific_course_name field when course_type is "Other"
  if (question === 'specific_course_name' && profile.course_type === 'Other') {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{questionDetails.text}</FormLabel>
        <Input
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your course name"
        />
        {questionDetails.helperText && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }

  // Special handling for university_name field
  if (question === 'university_name') {
    const options = additionalData.options || [];
    
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{questionDetails.text}</FormLabel>
        <Select
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Select university"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
        {questionDetails.helperText && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }

  // Special handling for specific_course_name field
  if (question === 'specific_course_name' && profile.course_type !== 'Other') {
    const options = additionalData.options || [];
    
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{questionDetails.text}</FormLabel>
        <Select
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Select course"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
        {questionDetails.helperText && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }

  // Add special handling for admission_status field
  if (question === 'admission_status') {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{questionDetails.text}</FormLabel>
        <Select
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Select admission status"
        >
          <option value="Admission letter received">Admission letter received</option>
          <option value="Conditional letter received">Conditional letter received</option>
          <option value="Admission letter not received">Admission letter not received</option>
          <option value="Admission rejected">Admission rejected</option>
          <option value="Not applied">Not applied</option>
        </Select>
        {questionDetails.helperText && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }

  // Add special handling for collateral_pincode field
  if (question === 'collateral_pincode') {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{questionDetails.text}</FormLabel>
        <Input
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter pincode"
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        {questionDetails.helperText && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }

  const renderField = () => {
    const commonProps = {
      helperText: questionDetails.helperText || (isRequired ? undefined : 'Optional'),
      'aria-required': isRequired,
      'aria-invalid': !!error
    };

    switch (questionDetails.type) {
      case 'text':
        return <TextField 
          value={value} 
          onChange={handleChange} 
          placeholder={questionDetails.placeholder}
          {...commonProps}
        />;

      case 'choice':
        return <ChoiceField 
          value={value} 
          onChange={handleChange}
          options={questionDetails.options || []}
          placeholder={isRequired ? 'Select (Required)' : 'Select (Optional)'}
          {...commonProps}
        />;

      case 'date':
        return <TextField 
          value={value} 
          onChange={handleChange}
          type="date" 
          {...commonProps}
        />;

      case 'score_format_combo':
        return <ScoreFormatCombo 
          value={value} 
          onChange={handleChange}
          options={questionDetails.scoreOptions || []}
          {...commonProps}
        />;

      case 'test_score_combo':
        return <TestScoreCombo 
          value={value} 
          onChange={handleChange}
          options={questionDetails.testOptions || []}
          {...commonProps}
        />;

      case 'amount_currency':
        return <AmountCurrencyField 
          value={value} 
          onChange={handleChange}
          {...commonProps}
        />;

      case 'course_duration':
        return <CourseDurationField 
          value={value} 
          onChange={handleChange}
          options={[
            Array.from({ length: 7 }, (_, i) => i.toString()),
            Array.from({ length: 13 }, (_, i) => i.toString())
          ]}
          {...commonProps}
        />;
        
      default:
        return null;
    }
  };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel>{questionDetails.text}</FormLabel>
      {renderField()}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default QuestionField;