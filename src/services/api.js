import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create API client with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://loanmonkl-render-be.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  error => {
    // Log the error for debugging
    console.error('API Error:', error.response?.data);
    
    // Format validation errors
    if (error.response?.status === 422 && error.response?.data?.detail) {
      const details = error.response.data.detail;
      const messages = details.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n');
      return Promise.reject(new Error(messages));
    }
    
    // Enhance error with more details
    const enhancedError = new Error(
      error.response?.data?.detail || 
      error.response?.data?.message || 
      'An unexpected error occurred'
    );
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

/**
 * Transform frontend profile structure to match backend expectations
 */
const transformProfileForBackend = (profile) => {
  // Create a new object with the expected backend structure
  const transformedProfile = {
    // Map basic_info fields to root level
    name: profile.basic_info?.name,
    email: profile.basic_info?.email,
    mobile_number: profile.basic_info?.mobile_number,
    date_of_birth: profile.basic_info?.date_of_birth,
    current_location_pincode: profile.basic_info?.current_location_pincode,
    current_location_city: profile.basic_info?.current_location_city,
    current_location_state: profile.basic_info?.current_location_state,
    
    // Transform education details
    education_details: profile.education_details ? {
      ...profile.education_details,
      // Convert single values to arrays where needed
      study_destination_country: profile.education_details.study_destination_country ? 
        [profile.education_details.study_destination_country] : undefined,
      university_name: profile.education_details.university_name ? 
        [profile.education_details.university_name] : undefined,
      // Convert string numbers to integers
      educational_backlogs: profile.education_details.educational_backlogs ? 
        parseInt(profile.education_details.educational_backlogs) : undefined,
      education_gap_duration: profile.education_details.education_gap_duration ? 
        parseInt(profile.education_details.education_gap_duration) : undefined
    } : undefined,
    
    // Include other sections directly
    loan_details: profile.loan_details || {},
    co_applicant_details: profile.co_applicant_details || {},
    
    // Include student_id if available
    ...(profile.student_id ? { student_id: profile.student_id } : {})
  };
  
  return transformedProfile;
};

/**
 * Save or update student profile
 */
export const saveStudentProfile = async (profile) => {
  try {
    // Transform profile to match backend expectations
    const transformedProfile = transformProfileForBackend(profile);
    console.log('Transformed profile:', transformedProfile);
    
    const response = await api.post('/api/students', transformedProfile);
    return response.data;
  } catch (error) {
    console.error('Error saving student profile:', error);
    throw error;
  }
};

/**
 * Fetch universities, optionally filtered by country
 */
export const fetchUniversities = async (country = '') => {
  try {
    const response = await api.get('/api/universities', {
      params: country ? { country } : {}
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
};

/**
 * Fetch courses based on university, degree, and study area
 */
export const fetchCourses = async ({ course_type }) => {
  try {
    const response = await api.get('/api/courses', {
      params: { course_type }
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

/**
 * Fetch city and state details for a pincode
 */
export const fetchPincodeDetails = async (pincode) => {
  if (!pincode || pincode.length < 6) {
    return { city: '', state: '' };
  }
  
  try {
    const response = await api.get(`/api/pincode/${pincode}`);
    return response.data || { city: '', state: '' };
  } catch (error) {
    console.error('Error fetching pincode details:', error);
    return { city: '', state: '' };
  }
};

/**
 * Match student profile with vendors
 */
export const matchVendors = async (profile) => {
  try {
    // Transform profile to match backend expectations
    const transformedProfile = transformProfileForBackend(profile);
    
    const response = await api.post('/api/vendors/match', transformedProfile);
    return response.data;
  } catch (error) {
    console.error('Error matching vendors:', error);
    return { matches: [], summary: "Failed to match vendors: " + error.message };
  }
};

/**
 * Generate document list for student
 */
export const generateDocumentList = async (profile) => {
  try {
    const transformedProfile = transformProfileForBackend(profile);
    if (transformedProfile.co_applicant_details) {
      transformedProfile.co_applicant_details.co_applicant_existing_loan_amount = {
        amount: 0,
        currency: "INR"
      };
      transformedProfile.co_applicant_details.co_applicant_existing_loan_emi_amount = {
        amount: 0,
        currency: "INR"
      };
    }

    // Make the API call with a custom responseType to handle plain text
    const response = await api.post('/api/documents/generate', transformedProfile, {
      responseType: 'text' // Tell axios to treat the response as plain text
    });

    // Split the plain text response into an array of lines
    const documentList = response.data.split('\n').filter(line => line.trim() !== '');
    console.log('Parsed document list:', documentList);

    // Return as an object with document_list field to match frontend expectation
    return { document_list: documentList };
  } catch (error) {
    console.error('Error generating document list:', error);
    throw error;
  }
};
/**
 * Get pre-signed URL for document upload
 */
export const getUploadUrl = async (studentId, documentType, fileName) => {
  try {
    // Use POST method with request body as per backend API
    const response = await api.post('/api/documents/upload-url', {
      student_id: studentId,
      document_type: documentType,
      file_name: fileName
    });
    return response.data;
  } catch (error) {
    console.error('Error getting upload URL:', error);
    throw error;
  }
};