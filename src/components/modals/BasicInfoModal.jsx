import React, { useState, useEffect } from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import { BaseModal, QuestionField } from '../shared';
import { fetchPincodeDetails } from '../../services/api';

const BasicInfoModal = () => {
  const { studentProfile, updateProfile, setCurrentModal, setLoading } = useStore();
  const [errors, setErrors] = useState({});
  const [locationInfo, setLocationInfo] = useState({ city: '', state: '' });

  const fields = ['name', 'mobile_number', 'email', 'date_of_birth', 'current_location_pincode'];

  // Effect to fetch city and state when pincode changes
  useEffect(() => {
    const pincode = studentProfile.basic_info?.current_location_pincode;
    if (pincode && pincode.length >= 6) {
      setLoading(true);
      fetchPincodeDetails(pincode)
        .then(data => {
          if (data.city && data.state) {
            setLocationInfo({ city: data.city, state: data.state });
            // Update the city and state in the profile
            updateProfile('basic_info', 'current_location_city', data.city);
            updateProfile('basic_info', 'current_location_state', data.state);
          }
        })
        .catch(err => {
          console.error('Error fetching pincode details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [studentProfile.basic_info?.current_location_pincode]);

  const handleFieldChange = (field, value) => {
    // Pass the direct value to updateProfile
    updateProfile('basic_info', field, value);
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    // Always allow proceeding to next step
    setCurrentModal('education');
  };

  return (
    <BaseModal 
      title="Basic Information" 
      onSubmit={handleSubmit}
      isValid={true} // Always enable the Next button
      showBackButton={false}
    >
      <VStack spacing={6}>
        {fields.map(fieldKey => (
          <QuestionField
            key={fieldKey}
            question={fieldKey}
            value={studentProfile.basic_info?.[fieldKey] || ''}
            onChange={(value) => handleFieldChange(fieldKey, value)}
            error={errors[fieldKey]}
            setError={(error) => setErrors(prev => ({ ...prev, [fieldKey]: error }))}
            profile={studentProfile.basic_info}
            section="basic_info"
            isRequired={false} // Make all fields optional
          />
        ))}
        
        {/* Display city and state if available */}
        {locationInfo.city && locationInfo.state && (
          <Box width="100%" p={3} bg="green.50" borderRadius="md">
            <Text color="green.700">
              Location: {locationInfo.city}, {locationInfo.state}
            </Text>
          </Box>
        )}
      </VStack>
    </BaseModal>
  );
};

export default BasicInfoModal;