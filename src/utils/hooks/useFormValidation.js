import { useState, useCallback } from 'react';
import { validateEmail, validatePhone, validatePincode, validateScore } from '../validators';

export const useFormValidation = (initialErrors = {}) => {
  const [errors, setErrors] = useState(initialErrors);

  const validateField = useCallback((key, value, options = {}) => {
    switch (key) {
      case 'email':
        return value && !validateEmail(value) ? "Invalid email format" : null;
      case 'mobile_number':
        return value && !validatePhone(value) ? "Invalid phone number" : null;
      case 'current_location_pincode':
        return value && !validatePincode(value) ? "Invalid pincode" : null;
      case 'marks_10th':
      case 'marks_12th':
      case 'academic_score':
        return value && !validateScore(value, options.format, options.scoreOptions) 
          ? `Invalid ${options.format} score` 
          : null;
      default:
        return null;
    }
  }, []);

  const setFieldError = useCallback((key, error) => {
    setErrors(prev => ({
      ...prev,
      [key]: error
    }));
  }, []);

  const clearFieldError = useCallback((key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setErrors,
    validateField,
    setFieldError,
    clearFieldError,
    hasErrors
  };
};
