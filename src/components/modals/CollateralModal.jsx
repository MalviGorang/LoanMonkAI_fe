import React, { useState, useEffect } from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import { BaseModal, QuestionField } from '../shared';
import { fetchPincodeDetails } from '../../services/api';

const CollateralModal = () => {
  const { studentProfile, updateProfile, setCurrentModal, goBack, setLoading } = useStore();
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState({ city: '', state: '' });

  // Group fields by their dependencies
  const fields = [
    // Collateral fields
    'collateral_available',
    'collateral_type',
    'collateral_value_amount',
    'collateral_location_pincode',
    'collateral_existing_loan',
    'collateral_existing_loan_amount',
    'collateral_existing_loan_emi_amount',
    // Co-applicant fields in proper order
    'co_applicant_available',
    'co_applicant_relation',
    'co_applicant_occupation',
    'co_applicant_income_amount',
    'co_applicant_house_ownership',
    'co_applicant_maintains_average_balance',
    'co_applicant_existing_loan',
    'co_applicant_existing_loan_amount',
    'co_applicant_existing_loan_emi_amount',
    'co_applicant_emi_default',
    'cibil_score'
  ];

  useEffect(() => {
    const pincode = studentProfile.loan_details?.collateral_location_pincode;
    if (pincode && pincode.length >= 6) {
      setLoading(true);
      fetchPincodeDetails(pincode)
        .then(data => {
          if (data.city && data.state) {
            setLocation({ city: data.city, state: data.state });
            updateProfile("loan_details", "collateral_location_city", data.city);
            updateProfile("loan_details", "collateral_location_state", data.state);
          }
        })
        .catch(err => {
          console.error('Error fetching pincode details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [studentProfile.loan_details?.collateral_location_pincode]);

  // Handle field change
  const handleFieldChange = (field, value) => {
    updateProfile('loan_details', field, value);
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Reset dependent fields when parent field changes
    if (field === 'co_applicant_available' && value === 'No') {
      // Clear all co-applicant fields when co-applicant is set to No
      const coApplicantFields = [
        'co_applicant_relation',
        'co_applicant_occupation',
        'co_applicant_income_amount',
        'co_applicant_house_ownership',
        'co_applicant_maintains_average_balance',
        'co_applicant_existing_loan',
        'co_applicant_existing_loan_amount',
        'co_applicant_existing_loan_emi_amount',
        'co_applicant_emi_default'
      ];
      coApplicantFields.forEach(field => updateProfile('loan_details', field, ''));
    } else if (field === 'co_applicant_existing_loan' && value === 'No') {
      // Clear loan-related fields when existing loan is set to No
      const loanFields = [
        'co_applicant_existing_loan_amount',
        'co_applicant_existing_loan_emi_amount',
        'co_applicant_emi_default'
      ];
      loanFields.forEach(field => updateProfile('loan_details', field, ''));
    }
  };

  const handleSubmit = () => {
    // Always proceed to next step
    setCurrentModal('identification');
  };

  return (
    <BaseModal 
      title="Collateral and Co-Applicant Details" 
      onSubmit={handleSubmit}
      onBack={goBack}
      isValid={true} // Always enable the Next button
      skipText="Skip Collateral" // Add skip option
    >
      <VStack spacing={6}>
        {fields.map(fieldKey => (
          <QuestionField
            key={fieldKey}
            question={fieldKey}
            value={studentProfile.loan_details?.[fieldKey]}
            onChange={(value) => handleFieldChange(fieldKey, value)}
            error={errors[fieldKey]}
            setError={(error) => setErrors(prev => ({ ...prev, [fieldKey]: error }))}
            profile={studentProfile.loan_details || {}}
            section="loan_details"
            isRequired={false} // Make all fields optional
          />
        ))}
        
        {/* Display city and state if available */}
        {location.city && location.state && studentProfile.loan_details?.collateral_location_pincode && (
          <Box width="100%" p={3} bg="green.50" borderRadius="md">
            <Text color="green.700">
              Collateral Location: {location.city}, {location.state}
            </Text>
          </Box>
        )}
      </VStack>
    </BaseModal>
  );
};

export default CollateralModal;