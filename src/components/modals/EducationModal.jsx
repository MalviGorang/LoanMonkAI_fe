import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import { BaseModal, QuestionField } from '../shared';

const EducationModal = () => {
  const { studentProfile, setCurrentModal, updateProfile, goBack } = useStore();
  const [errors, setErrors] = useState({});

  const fields = [
    'marks_10th', 'marks_12th', 'highest_education_level', 'academic_score',
    'educational_backlogs', 'education_gap', 'education_gap_duration',
    'current_profession', 'yearly_income'
  ];

  // Handle field change
  const handleFieldChange = (field, value) => {
    updateProfile('education_details', field, value);
    
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
    // Always proceed to next step, regardless of errors
    setCurrentModal('study_plan');
  };

  return (
    <BaseModal 
      title="Education Details" 
      onSubmit={handleSubmit}
      onBack={goBack}
      isValid={true} // Always enable the Next button
    >
      <VStack spacing={6}>
        {fields.map(fieldKey => (
          <QuestionField
            key={fieldKey}
            question={fieldKey}
            value={studentProfile.education_details?.[fieldKey]}
            onChange={(value) => handleFieldChange(fieldKey, value)}
            error={errors[fieldKey]}
            setError={(error) => setErrors(prev => ({ ...prev, [fieldKey]: error }))}
            profile={studentProfile.education_details || {}}
            section="education_details"
            isRequired={false} // Make all fields optional
          />
        ))}
      </VStack>
    </BaseModal>
  );
};

export default EducationModal;