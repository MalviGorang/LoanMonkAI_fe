import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  Text,
  Box,
} from '@chakra-ui/react';
import { QUESTION_DETAILS } from '../../utils/constants';
import {
  TextField,
  ChoiceField,
  ScoreFormatCombo,
  TestScoreCombo,
  AmountCurrencyField,
  CourseDurationField,
  SearchableChoiceField
} from './FormFieldTypes';
import { 
  validateEmail, 
  validatePhone, 
  validatePan, 
  validateAadhaar, 
  validatePincode 
} from '../../utils/validators';

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

  // Create a local state to track if the field is being edited
  const [isTouched, setIsTouched] = useState(false);
  
  // Validate in real-time as the user types
  const validateField = (value) => {
    if (!value && !isRequired) return null; // Optional fields are valid when empty
    if (!value && isRequired) return 'This field is required';
    
    // Field-specific validations
    switch (question) {
      case 'phone_number':
        if (!validatePhone(value)) {
          return 'Enter a valid phone number (e.g., +911234567890)';
        }
        break;
        
      case 'pan_number':
        if (!validatePan(value)) {
          return 'Enter a valid PAN number (e.g., ABCDE1234F)';
        }
        break;
        
      case 'aadhaar_number':
        if (!validateAadhaar(value)) {
          return 'Enter a valid 12-digit Aadhaar number';
        }
        break;
        
      case 'email':
        if (!validateEmail(value)) {
          return 'Enter a valid email address';
        }
        break;
        
      case 'pincode':
      case 'collateral_pincode':
        if (!validatePincode(value)) {
          return 'Enter a valid pincode (4-10 digits)';
        }
        break;
        
      default:
        // Use question's built-in validation if available
        if (questionDetails.validate) {
          return questionDetails.validate(value, profile);
        }
    }
    
    return null;
  };
  
  // Run validation when field value changes and the field has been touched
  useEffect(() => {
    if (isTouched && setError) {
      const errorMessage = validateField(value);
      setError(errorMessage);
    }
  }, [value, isTouched]);

  const handleChange = (newValue) => {
    if (typeof onChange === 'function') {
      onChange(newValue);
      
      // Mark field as touched on first change
      if (!isTouched) {
        setIsTouched(true);
      }
      
      // Immediate validation
      if (setError) {
        const errorMessage = validateField(newValue);
        setError(errorMessage);
      }
    }
  };
  
  const handleBlur = () => {
    setIsTouched(true);
    if (setError) {
      const errorMessage = validateField(value);
      setError(errorMessage);
    }
  };
  
  // Handle keyboard events for fields
  const handleKeyDown = (e) => {
    // For Tab key navigation with validation
    if (e.key === 'Tab' && !e.shiftKey) {
      handleBlur();
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
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          borderColor={error ? "red.300" : undefined}
          _hover={{ borderColor: error ? "red.400" : undefined }}
        />
        {questionDetails.helperText && !error && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
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
        <SearchableChoiceField
          value={value || ''}
          onChange={handleChange}
          options={options}
          placeholder="Search university"
          helperText={questionDetails.helperText}
          onBlur={handleBlur}
        />
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
        <SearchableChoiceField
          value={value || ''}
          onChange={handleChange}
          options={options}
          placeholder="Search course"
          helperText={questionDetails.helperText}
          onBlur={handleBlur}
        />
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
          onBlur={handleBlur}
          borderColor={error ? "red.300" : undefined}
          _hover={{ borderColor: error ? "red.400" : undefined }}
        >
          <option value="Admission letter received">Admission letter received</option>
          <option value="Conditional letter received">Conditional letter received</option>
          <option value="Admission letter not received">Admission letter not received</option>
          <option value="Admission rejected">Admission rejected</option>
          <option value="Not applied">Not applied</option>
        </Select>
        {questionDetails.helperText && !error && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
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
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          borderColor={error ? "red.300" : undefined}
          _hover={{ borderColor: error ? "red.400" : undefined }}
        />
        {questionDetails.helperText && !error && <FormHelperText>{questionDetails.helperText}</FormHelperText>}
        {error && (
          <FormErrorMessage>
            {error} {error && "Example: 110001"}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }

  const renderField = () => {
    const commonProps = {
      helperText: questionDetails.helperText || (isRequired ? undefined : 'Optional'),
      'aria-required': isRequired,
      'aria-invalid': !!error,
      onBlur: handleBlur
    };

    // Special case for study_destination_country
    if (question === 'study_destination_country') {
      return <SearchableChoiceField 
        value={value} 
        onChange={handleChange}
        options={questionDetails.options || []}
        placeholder="Search country"
        {...commonProps}
      />;
    }

    switch (questionDetails.type) {
      case 'text':
        return (
          <Box>
            <TextField 
              value={value} 
              onChange={handleChange} 
              placeholder={questionDetails.placeholder}
              borderColor={error ? "red.300" : undefined}
              _hover={{ borderColor: error ? "red.400" : undefined }}
              onKeyDown={handleKeyDown}
              {...commonProps}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={1}>
                {error}
                {question === 'phone_number' && " Example: +911234567890"}
                {question === 'pan_number' && " Example: ABCDE1234F"}
                {question === 'aadhaar_number' && " Example: 123456789012"}
                {question === 'email' && " Example: name@example.com"}
                {question === 'pincode' && " Example: 110001"}
              </Text>
            )}
          </Box>
        );

      case 'choice':
        return <ChoiceField 
          value={value} 
          onChange={handleChange}
          options={questionDetails.options || []}
          placeholder={isRequired ? 'Select (Required)' : 'Choose an option'}
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
        return (
          <Box>
            <ScoreFormatCombo 
              value={value} 
              onChange={handleChange}
              options={questionDetails.scoreOptions || []}
              borderColor={error ? "red.300" : undefined}
              _hover={{ borderColor: error ? "red.400" : undefined }}
              {...commonProps}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={1}>
                {error}
              </Text>
            )}
          </Box>
        );

      case 'test_score_combo':
        return (
          <Box>
            <TestScoreCombo 
              value={value} 
              onChange={handleChange}
              options={questionDetails.testOptions || []}
              borderColor={error ? "red.300" : undefined}
              _hover={{ borderColor: error ? "red.400" : undefined }}
              {...commonProps}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={1}>
                {error}
              </Text>
            )}
          </Box>
        );

      case 'amount_currency':
        return (
          <Box>
            <AmountCurrencyField 
              value={value} 
              onChange={handleChange}
              borderColor={error ? "red.300" : undefined}
              _hover={{ borderColor: error ? "red.400" : undefined }}
              {...commonProps}
            />
            {error && (
              <Text fontSize="xs" color="red.500" mt={1}>
                {error}
              </Text>
            )}
          </Box>
        );

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
      {/* Form-level error message is now handled within each field type */}
    </FormControl>
  );
};

export default QuestionField;