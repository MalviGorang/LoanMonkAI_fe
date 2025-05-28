export const CURRENCY_OPTIONS = ['INR', 'USD', 'CAD', 'GBP', 'EUR'];

// Country options with exact names as per backend requirements
export const COUNTRY_OPTIONS = [
  'Afghanistan',
  'Australia',
  'Bangladesh',
  'Belize',
  'Burundi',
  'Cambodia',
  'Canada',
  'China',
  'Croatia',
  'Cyprus',
  'Czechia',
  'East Timor',
  'Egypt',
  'France',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Hong Kong',
  'Hungary',
  'India',
  'Iran',
  'Israel',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Libya',
  'Malaysia',
  'Mongolia',
  'Netherlands',
  'Nigeria',
  'Pakistan',
  'Philippines',
  'Poland',
  'Russia',
  'Rwanda',
  'Slovakia',
  'South Africa',
  'Switzerland',
  'Taiwan',
  'Tanzania',
  'Turkey',
  'UAE',
  'UK',
  'Ukraine',
  'US',
  'Vietnam',
  'Zambia',
  'Zimbabwe'
];

// Course type options
export const COURSE_TYPES = ['STEM', 'Non-STEM', 'Management', 'Other'];

export const QUESTION_DETAILS = {
  // Basic Info
  name: {
    type: 'text',
    text: "What's your full name?",
    placeholder: 'Enter your full name',
    helperText: 'Your legal name as it appears on documents',
    validate: (value) => !value ? 'Name is required' : null
  },
  mobile_number: {
    type: 'text',
    text: "What's your mobile number? (with country code)",
    placeholder: '+919876543210',
    helperText: 'Include country code (e.g., +91 for India)',
    validate: (value) => {
      if (!value) return 'Mobile number is required';
      if (!/^\+[1-9]\d{6,14}$/.test(value)) return 'Invalid mobile number format';
      return null;
    }
  },
  email: {
    type: 'text',
    text: "What's your email address?",
    placeholder: 'you@example.com',
    helperText: 'We will send important updates to this email',
    validate: (value) => {
      if (!value) return 'Email is required';
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(value.toLowerCase())) return 'Invalid email format';
      return null;
    }
  },
  date_of_birth: {
    type: 'date',
    text: "What's your date of birth?",
    helperText: 'Format: YYYY-MM-DD',
    validate: (value) => !value ? 'Date of birth is required' : null
  },
  current_location_pincode: {
    type: 'text',
    text: "What's your 6-digit home pincode?",
    placeholder: '400001',
    helperText: 'Enter pincode to auto-fill city and state',
    validate: (value) => {
      if (!value) return 'Pincode is required';
      if (!/^[0-9]{4,10}$/.test(value)) return 'Invalid pincode format';
      return null;
    }
  },

  // Education Details
  marks_10th: {
    type: 'score_format_combo',
    text: "What was your 10th standard score?",
    helperText: 'Select format and enter your score',
    scoreOptions: [
      { format: 'Percentage', range: { min: 0, max: 100 } },
      { format: 'CGPA', range: { min: 0, max: 10 } }
    ],
    validate: (value) => {
      if (!value?.format) return 'Score format is required';
      if (!value?.value && value.value !== 0) return 'Score value is required';
      const option = value.format === 'Percentage' ? 
        { min: 0, max: 100 } : { min: 0, max: 10 };
      if (value.value < option.min || value.value > option.max) {
        return `Score must be between ${option.min} and ${option.max}`;
      }
      return null;
    }
  },
  marks_12th: {
    type: 'score_format_combo',
    text: "What was your 12th standard score?",
    helperText: 'Select format and enter your score',
    scoreOptions: [
      { format: 'Percentage', range: { min: 0, max: 100 } },
      { format: 'CGPA', range: { min: 0, max: 10 } }
    ],
    validate: (value) => {
      if (!value?.format) return 'Score format is required';
      if (!value?.value && value.value !== 0) return 'Score value is required';
      const option = value.format === 'Percentage' ? 
        { min: 0, max: 100 } : { min: 0, max: 10 };
      if (value.value < option.min || value.value > option.max) {
        return `Score must be between ${option.min} and ${option.max}`;
      }
      return null;
    }
  },
  highest_education_level: {
    type: 'choice',
    text: "What's your highest education level?",
    helperText: 'Select your highest completed education',
    options: ['High School', 'UG_Diploma', 'Bachelors', 'Masters', 'PG_Diploma', 'PG', 'Other'],
    validate: (value) => !value ? 'Education level is required' : null
  },
  academic_score: {
    type: 'score_format_combo',
    text: "What's the score of your highest degree?",
    helperText: 'Select format and enter your score',
    scoreOptions: [
      { format: 'Percentage', range: { min: 0, max: 100 } },
      { format: 'CGPA', range: { min: 0, max: 10 } }
    ],
    condition: "highest_education_level != 'High School'",
    validate: (value) => {
      if (!value?.format) return 'Score format is required';
      if (!value?.value && value.value !== 0) return 'Score value is required';
      const option = value.format === 'Percentage' ? 
        { min: 0, max: 100 } : { min: 0, max: 10 };
      if (value.value < option.min || value.value > option.max) {
        return `Score must be between ${option.min} and ${option.max}`;
      }
      return null;
    }
  },
  educational_backlogs: {
    type: 'choice',
    text: 'Do you have any backlogs?',
    helperText: 'Select the number of backlogs',
    options: Array.from({ length: 21 }, (_, i) => i.toString()),
    validate: (value) => value === undefined ? 'Please select number of backlogs' : null
  },
  education_gap: {
    type: 'choice',
    text: 'Did you have a gap in your education?',
    helperText: 'Select yes if you had any gap in education',
    options: ['No', 'Yes'],
    validate: (value) => !value ? 'Please select yes or no' : null
  },
  education_gap_duration: {
    type: 'choice',
    text: 'How long was your education gap? (in months)',
    helperText: 'Select the duration of your education gap',
    condition: "education_gap == 'Yes'",
    options: Array.from({ length: 31 }, (_, i) => i.toString()),
    validate: (value) => !value ? 'Gap duration is required' : null
  },
  current_profession: {
    type: 'choice',
    text: 'What is your current profession?',
    helperText: 'Select your current occupation',
    options: ['Student', 'Employed', 'Unemployed', 'Self-Employed', 'Other'],
    validate: (value) => !value ? 'Profession is required' : null
  },
  yearly_income: {
    type: 'amount_currency',
    text: "What's your yearly income?",
    helperText: 'Enter your annual income',
    condition: "current_profession in ['Employed','Self-Employed']",
    validate: (value) => {
      if (!value?.amount) return 'Income amount is required';
      if (!value?.currency) return 'Currency is required';
      if (value.amount <= 0) return 'Income must be greater than 0';
      return null;
    }
  },

  // Study Plan
  study_destination_country: {
    type: 'choice',
    text: 'Which country will you study in?',
    helperText: 'Select your target study destination',
    options: COUNTRY_OPTIONS,
    validate: (value) => !value ? 'Country is required' : null,
    order: 1
  },
  university_name: {
    type: 'choice',
    text: "What's the name of your university?",
    helperText: 'Select your target university',
    validate: (value) => !value ? 'University name is required' : null,
    order: 2
  },
  admission_status: {
    text: "What is your admission status?",
    type: "choice",
    order: 3, // Place right after university selection
    options: [
      "Admission letter received", "Conditional letter received", "Admission letter not received", "Admission rejected", "Not applied"
    ],
    helperText: "Select your current admission status",
    section: "study_plan", // Add section identifier
    required: true,
    validate: (value) => !value ? "Please select your admission status" : null
  },
  course_type: {
    type: 'choice',
    text: 'What type of course are you interested in?',
    helperText: 'Select the category of your course',
    options: COURSE_TYPES,
    validate: (value) => !value ? 'Course type is required' : null,
    order: 4
  },
  intended_degree: {
    type: 'choice',
    text: 'Which degree will you pursue?',
    helperText: 'Select the degree you plan to study',
    options: ['Masters', 'Bachelors', 'PgDiploma'],
    validate: (value) => !value ? 'Degree is required' : null
  },
  specific_course_name: {
    type: 'text',
    text: 'What course will you study?',
    helperText: 'Enter the specific course or major',
    validate: (value) => !value ? 'Course name is required' : null
  },
  target_intake: {
    type: 'choice',
    text: 'Which intake are you aiming for?',
    helperText: 'Select your target admission season',
    options: ['Spring', 'Fall', 'Summer', 'Winter'],
    validate: (value) => !value ? 'Target intake is required' : null
  },
  course_duration: {
    type: 'course_duration',
    text: 'How long is your course?',
    helperText: 'Select the duration of your course',
    validate: (value) => {
      if (!value?.years && value?.years !== '0') return 'Years is required';
      if (!value?.months && value?.months !== '0') return 'Months is required';
      return null;
    }
  },
  loan_amount_requested: {
    type: 'amount_currency',
    text: 'How much loan do you need?',
    helperText: 'Enter the loan amount you wish to apply for',
    validate: (value) => {
      if (!value?.amount) return 'Loan amount is required';
      if (value.amount <= 0) return 'Amount must be greater than 0';
      return null;
    }
  },

  // Test Scores
  english_test: {
    type: 'test_score_combo',
    text: 'Which English test did you take?',
    helperText: 'Select test type and enter your score',
    testOptions: [
      { type: 'IELTS', range: { min: 0, max: 9 } },
      { type: 'TOEFL', range: { min: 0, max: 120 } },
      { type: 'PTE', range: { min: 10, max: 90 } },
      { type: 'Duolingo', range: { min: 10, max: 160 } },
      { type: 'None' }
    ],
    validate: (value) => {
      if (!value?.type) return 'Test type is required';
      if (value.type !== 'None' && !value?.score && value.score !== 0) {
        return 'Test score is required';
      }
      
      if (value.type !== 'None') {
        const option = QUESTION_DETAILS.english_test.testOptions.find(opt => opt.type === value.type);
        if (option && (value.score < option.range.min || value.score > option.range.max)) {
          return `Score must be between ${option.range.min} and ${option.range.max}`;
        }
      }
      return null;
    }
  },
  standardized_test: {
    type: 'test_score_combo',
    text: 'Did you take a standardized test like GRE or GMAT?',
    helperText: 'Select test type and enter your score',
    testOptions: [
      { type: 'GRE', range: { min: 260, max: 340 } },
      { type: 'GMAT', range: { min: 200, max: 800 } },
      { type: 'None' }
    ],
    validate: (value) => {
      if (!value?.type) return 'Test type is required';
      if (value.type !== 'None' && !value?.score && value.score !== 0) {
        return 'Test score is required';
      }
      
      if (value.type !== 'None') {
        const option = QUESTION_DETAILS.standardized_test.testOptions.find(opt => opt.type === value.type);
        if (option && (value.score < option.range.min || value.score > option.range.max)) {
          return `Score must be between ${option.range.min} and ${option.range.max}`;
        }
      }
      return null;
    }
  },

  // Collateral and Co-Applicant Details 
  collateral_available: {
    type: 'choice',
    text: 'Do you have collateral for a secured loan?',
    helperText: 'Collateral can help secure better loan terms',
    options: ['Yes', 'No'],
    validate: (value) => !value ? 'Please select yes or no' : null,
    order: 60
  },
  collateral_type: {
    type: 'choice',
    text: 'What type of collateral do you have?',
    helperText: 'Select the type of collateral you can provide',
    condition: "collateral_available == 'Yes'",
    options: ['Residential', 'Commercial', 'Land', 'Farm Land', 'FD'],
    validate: (value) => !value ? 'Collateral type is required' : null,
    order: 61
  },
  collateral_location_pincode: {
    text: "What's the pincode of your collateral property?",
    type: "text",
    order: 62, // Place right after collateral type
    condition: "collateral_available == 'Yes' && collateral_type != 'FD'",
    placeholder: "Enter 6-digit pincode",
    helperText: "Enter the postal code where property is located",
    section: "collateral", // Add section identifier
    required: true,
    validate: (value) => {
      if (!value) return "Pincode is required";
      if (!/^\d{6}$/.test(value)) return "Please enter a valid 6-digit pincode";
      return null;
    }
  },
  collateral_value_amount: {
    type: 'amount_currency',
    text: "What's the value of your collateral?",
    helperText: 'Enter the approximate market value',
    condition: "collateral_available == 'Yes'",
    validate: (value) => {
      if (!value?.amount) return 'Collateral value is required';
      if (!value?.currency) return 'Currency is required';
      if (value.amount <= 0) return 'Value must be greater than 0';
      return null;
    },
    order: 63
  },
  collateral_existing_loan: {
    type: 'choice',
    text: 'Is there an existing loan on this collateral?',
    helperText: 'Select yes if the collateral has any existing loan',
    condition: "collateral_available == 'Yes'",
    options: ['Yes', 'No'],
    validate: (value) => !value ? 'Please select yes or no' : null
  },
  collateral_existing_loan_amount: {
    type: 'amount_currency',
    text: "What's the remaining loan amount on your collateral?",
    helperText: 'Enter the outstanding loan amount',
    condition: "collateral_existing_loan == 'Yes'",
    validate: (value) => {
      if (!value?.amount) return 'Loan amount is required';
      if (value.amount < 0) return 'Amount cannot be negative';
      return null;
    }
  },
  co_applicant_available: {
    type: 'choice',
    text: 'Do you have a co-applicant for your loan?',
    helperText: 'A co-applicant can improve loan eligibility',
    options: ['Yes', 'No'],
    validate: (value) => !value ? 'Please select yes or no' : null
  },
  co_applicant_relation: {
    type: 'choice',
    text: 'What is your relationship with the co-applicant?',
    helperText: 'Select your relationship with the co-applicant',
    condition: "co_applicant_available == 'Yes'",
    options: ['Father', 'Mother', 'Spouse', 'Sibling', 'Other'],
    validate: (value) => !value ? 'Relationship is required' : null
  },
  co_applicant_occupation: {
    type: 'choice',
    text: "What's your co-applicant's occupation?",
    helperText: 'Select your co-applicant\'s occupation',
    condition: "co_applicant_available == 'Yes'",
    options: ['Salaried', 'Self-Employed', 'Farmer', 'Unemployed', 'Other'],
    validate: (value) => !value ? 'Occupation is required' : null
  },
  co_applicant_income_amount: {
    type: 'amount_currency',
    text: "What's your co-applicant's yearly income?",
    helperText: 'Enter your co-applicant\'s annual income',
    condition: "co_applicant_available == 'Yes'",
    validate: (value) => {
      if (!value?.amount) return 'Income amount is required';
      if (!value?.currency) return 'Currency is required';
      if (value.amount <= 0) return 'Income must be greater than 0';
      return null;
    }
  },
  co_applicant_existing_loan: {
    type: 'choice',
    text: 'Does your co-applicant have any existing loans?',
    helperText: 'Select yes if your co-applicant has any loans',
    condition: "co_applicant_available == 'Yes'",
    options: ['Yes', 'No'],
    validate: (value) => !value ? 'Please select yes or no' : null
  },
  co_applicant_existing_loan_amount: {
    type: 'amount_currency',
    text: "What's the remaining loan amount for your co-applicant?",
    helperText: 'Enter the total outstanding loan amount',
    condition: "co_applicant_existing_loan == 'Yes'",
    validate: (value) => {
      if (!value?.amount) return 'Loan amount is required';
      if (value.amount < 0) return 'Amount cannot be negative';
      return null;
    }
  },
  co_applicant_existing_loan_emi_amount: {
    type: 'amount_currency',
    text: "What's the monthly EMI for your co-applicant's loans?",
    helperText: 'Enter the total monthly EMI amount',
    condition: "co_applicant_existing_loan == 'Yes'",
    validate: (value) => {
      if (!value?.amount) return 'EMI amount is required';
      if (value.amount < 0) return 'Amount cannot be negative';
      return null;
    }
  },
  co_applicant_emi_default: {
    type: 'choice',
    text: 'Has your co-applicant defaulted on any EMI in the last 10 years?',
    helperText: 'Select yes if there have been any defaults',
    condition: "co_applicant_existing_loan == 'Yes'",
    options: ['Yes', 'No'],
    validate: (value) => !value ? 'Please select yes or no' : null
  },
  co_applicant_house_ownership: {
    type: 'choice',
    text: 'Does your co-applicant own a house?',
    helperText: 'Select yes if co-applicant owns a residential property',
    condition: "co_applicant_available == 'Yes'",
    options: ['Yes', 'No'],
    validate: (value) => !value ? 'Please select yes or no' : null
  },
  
  // Identification Details
  pan: {
    type: 'text',
    text: "What's your PAN number?",
    placeholder: 'ABCDE1234F',
    helperText: 'Format: 5 letters, 4 numbers, 1 letter',
    validate: (value) => {
      if (!value) return null; // Optional field
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) return 'Invalid PAN format';
      return null;
    }
  },
  aadhaar: {
    type: 'text',
    text: "What's your Aadhaar number?",
    placeholder: '1234 5678 9012',
    helperText: '12-digit number, spaces optional',
    validate: (value) => {
      if (!value) return null; // Optional field
      const cleanValue = value.replace(/\s/g, '');
      if (!/^\d{12}$/.test(cleanValue)) return 'Invalid Aadhaar format';
      return null;
    }
  },
  co_applicant_pan: {
    type: 'text',
    text: "What's your co-applicant's PAN number?",
    placeholder: 'ABCDE1234F',
    helperText: 'Format: 5 letters, 4 numbers, 1 letter',
    condition: "co_applicant_available == 'Yes'",
    validate: (value) => {
      if (!value) return null; // Optional field
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) return 'Invalid PAN format';
      return null;
    }
  },
  co_applicant_aadhaar: {
    type: 'text',
    text: "What's your co-applicant's Aadhaar number?",
    placeholder: '1234 5678 9012',
    helperText: '12-digit number, spaces optional',
    condition: "co_applicant_available == 'Yes'",
    validate: (value) => {
      if (!value) return null; // Optional field
      const cleanValue = value.replace(/\s/g, '');
      if (!/^\d{12}$/.test(cleanValue)) return 'Invalid Aadhaar format';
      return null;
    }
  },
  cibil_score: {
    type: 'text',
    text: "What's your CIBIL score?",
    placeholder: '750',
    helperText: 'Enter a number between 300-900',
    validate: (value) => {
      if (!value) return null; // Optional field
      const score = parseInt(value);
      if (isNaN(score) || score < 300 || score > 900) return 'Score must be between 300-900';
      return null;
    }
  }
};