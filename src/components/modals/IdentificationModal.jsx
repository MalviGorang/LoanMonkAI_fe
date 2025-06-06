import React, { useState, useEffect } from 'react';
import { VStack, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import { BaseModal, QuestionField } from '../shared';
import { saveStudentProfile, matchVendors, generateDocumentList } from '../../services/api';

const IdentificationModal = () => {
  const { 
    studentProfile, 
    updateProfile,
    setCurrentModal, 
    setVendorMatches, 
    setDocumentList,
    getCompleteProfile,
    setError,
    setLoading,
    goBack
  } = useStore();
  
  const [errors, setErrors] = useState({});
  const [duplicateIdError, setDuplicateIdError] = useState(null);

  const fields = [
    'pan',
    'aadhaar',
    'co_applicant_pan',
    'co_applicant_aadhaar'
  ];

  // Check for duplicate identification documents
  useEffect(() => {
    const studentPan = studentProfile.loan_details?.pan;
    const studentAadhaar = studentProfile.loan_details?.aadhaar;
    const coApplicantPan = studentProfile.loan_details?.co_applicant_pan;
    const coApplicantAadhaar = studentProfile.loan_details?.co_applicant_aadhaar;
    
    // Clean Aadhaar numbers (remove spaces)
    const cleanStudentAadhaar = studentAadhaar ? studentAadhaar.replace(/\s/g, '') : '';
    const cleanCoApplicantAadhaar = coApplicantAadhaar ? coApplicantAadhaar.replace(/\s/g, '') : '';
    
    // Only validate if both fields have values
    if (studentPan && coApplicantPan && studentPan === coApplicantPan) {
      setDuplicateIdError('Student and co-applicant cannot have the same PAN number');
    } else if (cleanStudentAadhaar && cleanCoApplicantAadhaar && cleanStudentAadhaar === cleanCoApplicantAadhaar) {
      setDuplicateIdError('Student and co-applicant cannot have the same Aadhaar number');
    } else {
      setDuplicateIdError(null);
    }
  }, [
    studentProfile.loan_details?.pan, 
    studentProfile.loan_details?.aadhaar, 
    studentProfile.loan_details?.co_applicant_pan, 
    studentProfile.loan_details?.co_applicant_aadhaar
  ]);

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
  };

  const handleSubmit = async () => {
    // Check for duplicate identification documents
    if (duplicateIdError) {
      setError(duplicateIdError);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const profile = getCompleteProfile();
      
      // Move co-applicant details to the correct object
      const coApplicantFields = [
        'co_applicant_relation',
        'co_applicant_occupation',
        'co_applicant_income_amount',
        'co_applicant_existing_loan',
        'co_applicant_existing_loan_amount',
        'co_applicant_existing_loan_emi_amount',
        'co_applicant_emi_default',
        'co_applicant_pan',
        'co_applicant_aadhaar'
      ];

      const coApplicantDetails = {};
      coApplicantFields.forEach(field => {
        if (profile.loan_details[field]) {
          coApplicantDetails[field] = profile.loan_details[field];
          delete profile.loan_details[field];
        }
      });

      const completeProfile = {
        ...profile,
        co_applicant_details: coApplicantDetails
      };
      
      // Save profile and get student_id
      const response = await saveStudentProfile(completeProfile);
      if (response?.student_id) {
        updateProfile('', 'student_id', response.student_id);
        
        // Match with vendors
        const vendorResponse = await matchVendors(completeProfile);
        setVendorMatches(vendorResponse);
        
        // Generate document list
        const docResponse = await generateDocumentList(completeProfile);
        setDocumentList(docResponse);
        
        // Navigate to dashboard
        setCurrentModal('dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to process application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal 
      title="Identification Details" 
      onSubmit={handleSubmit}
      onBack={goBack}
      isValid={!duplicateIdError} // Disable submit button if there's a duplicate ID error
      submitText="Submit Application"
    >
      <VStack spacing={6}>
        {duplicateIdError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{duplicateIdError}</AlertDescription>
          </Alert>
        )}
        
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
            isRequired={false}
          />
        ))}
      </VStack>
    </BaseModal>
  );
};

export default IdentificationModal;