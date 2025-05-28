import React, { useState, useEffect } from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import { useStore } from '../../store/store';
import { BaseModal, QuestionField } from '../shared';
import { fetchUniversities, fetchCourses } from '../../services/api';
import { formatAmount } from '../../utils/formatters';

const StudyPlanModal = () => {
  const { studentProfile, setCurrentModal, setSupportedVendors, updateProfile, goBack, setLoading } = useStore();
  const [errors, setErrors] = useState({});
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lastCountry, setLastCountry] = useState(null);
  
  const fields = [
    'study_destination_country',
    'university_name',
    'admission_status', // Added admission status field
    'course_type',
    'intended_degree',
    'specific_course_name',
    'target_intake',
    'course_duration',
    'loan_amount_requested'
  ];

  // Load universities when country changes
  useEffect(() => {
    const country = studentProfile.education_details?.study_destination_country;
    if (country && country !== lastCountry) {
      setLastCountry(country);
      loadUniversities(country);
    }
  }, [studentProfile.education_details?.study_destination_country]);

  const loadUniversities = async (country) => {
    if (!country) return;
    
    setLoading(true);
    try {
      const data = await fetchUniversities(country);
      setUniversities(data);
    } catch (error) {
      console.error("Failed to load universities:", error);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async (courseType) => {
    if (!courseType) {
      console.log("No course type provided, skipping course load");
      return;
    }
    
    setLoading(true);
    try {
      const fetchedCourses = await fetchCourses({ course_type: courseType });
      console.log("Fetched courses:", fetchedCourses);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (key, value) => {
    const sectionUpdates = {
      admission_status: 'education_details',
      // ...other mappings
    };

    const section = sectionUpdates[key] || 'education_details';
    updateProfile(section, key, value);
    
    // Special handling for specific fields
    if (key === 'university_name') {
      if (value) {
        const university = universities.find(u => u.name === value);
        setSupportedVendors(university?.vendors || []);
      } else {
        setSupportedVendors([]);
      }
    }
    
    // Load courses when course_type changes
    if (key === 'course_type') {
      console.log("Course type changed to:", value);
      loadCourses(value);
    }
    
    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    setCurrentModal('tests');
  };

  const renderField = (fieldKey) => {
    const commonProps = {
      key: fieldKey,
      question: fieldKey,
      value: studentProfile.education_details?.[fieldKey],
      onChange: (value) => handleFieldChange(fieldKey, value),
      error: errors[fieldKey],
      setError: (error) => setErrors(prev => ({ ...prev, [fieldKey]: error })),
      profile: studentProfile.education_details || {},
      section: "education_details",
      isRequired: false,
      format: fieldKey === 'loan_amount_requested' ? formatAmount : undefined
    };

    // Special handling for university_name field
    if (fieldKey === 'university_name') {
      return (
        <QuestionField
          {...commonProps}
          additionalData={{ options: universities.map(u => u.name) }}
        />
      );
    }

    // Special handling for specific_course_name field
    if (fieldKey === 'specific_course_name') {
      const courseType = studentProfile.education_details?.course_type;
      return (
        <QuestionField
          {...commonProps}
          additionalData={{ 
            options: courses,
            isFreeText: courseType === 'Other'
          }}
        />
      );
    }

    // Default handling for other fields
    return <QuestionField {...commonProps} />;
  };

  return (
    <BaseModal 
      title="Study Plan Details" 
      onSubmit={handleSubmit}
      onBack={goBack}
      isValid={true}
    >
      <VStack spacing={6}>
        {fields.map(renderField)}
        
        {/* Display selected country and university info */}
        {studentProfile.education_details?.study_destination_country && (
          <Box width="100%" p={3} bg="blue.50" borderRadius="md">
            <Text fontWeight="bold">
              Selected Country: {studentProfile.education_details.study_destination_country}
            </Text>
            
            {studentProfile.education_details?.university_name && (
              <Text mt={2}>
                Selected University: {studentProfile.education_details.university_name}
              </Text>
            )}
            
            {universities.length === 0 && (
              <Text color="orange.500" mt={2}>
                No universities found. Try selecting a different country.
              </Text>
            )}
            
            {studentProfile.education_details?.course_type && courses.length === 0 && (
              <Text color="orange.500" mt={2}>
                No courses found for the selected criteria.
              </Text>
            )}
          </Box>
        )}
      </VStack>
    </BaseModal>
  );
};

export default StudyPlanModal;