import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import { BaseModal, QuestionField } from '../shared';
import { refreshStorageExpiration } from '../../utils/storageCleanup';
import { useConditionalQuestions } from '../../utils/hooks/useConditionalQuestions';

const EducationModal = () => {
  const { studentProfile, setCurrentModal, updateProfile, goBack } = useStore();
  const [errors, setErrors] = useState({});

  const fields = [
    'marks_10th', 
    'marks_12th', 
    'highest_education_level', 
    'academic_score',
    'educational_backlogs', 
    'education_gap', 
    'education_gap_duration',
    'current_profession', 
    'yearly_income'
  ];

  // Handle field change
  const handleFieldChange = (field, value) => {
    // For debugging
    console.log(`Changing field ${field} to:`, value);
    
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
    // Refresh the 24-hour expiration time
    refreshStorageExpiration();
    
    // Always proceed to next step, regardless of errors
    setCurrentModal('study_plan');
  };

  // Create field visibility conditions using the hook
  const showEducationGapDuration = useConditionalQuestions('education_gap_duration', studentProfile.education_details || {});
  const showYearlyIncome = useConditionalQuestions('yearly_income', studentProfile.education_details || {});

  // Debug logging for conditional fields
  React.useEffect(() => {
    console.group('Conditional Field Rendering - Education Modal');
    console.log('Education Gap:', studentProfile.education_details?.education_gap);
    console.log('Show Education Gap Duration:', showEducationGapDuration);
    console.log('Current Profession:', studentProfile.education_details?.current_profession);
    console.log('Show Yearly Income:', showYearlyIncome);
    console.groupEnd();
  }, [
    studentProfile.education_details?.education_gap,
    showEducationGapDuration,
    studentProfile.education_details?.current_profession,
    showYearlyIncome
  ]);

  return (
    <BaseModal 
      title="Education Details" 
      onSubmit={handleSubmit}
      onBack={goBack}
      isValid={true} // Always enable the Next button
    >
      <VStack spacing={6}>
        {fields.map(fieldKey => {
          // Skip rendering certain fields based on conditions
          if (fieldKey === 'education_gap_duration' && !showEducationGapDuration) return null;
          if (fieldKey === 'yearly_income' && !showYearlyIncome) return null;
          
          return (
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
          );
        })}
      </VStack>
    </BaseModal>
  );
};

export default EducationModal

