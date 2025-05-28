export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Supports international phone numbers with country code
  // Example formats: +1234567890, +91987654321, +44123456789
  const re = /^\+[1-9]\d{6,14}$/;
  return re.test(phone);
};

export const validatePincode = (pincode) => {
  // Allow 4-10 digit postcodes/pincodes to support international formats
  const re = /^[0-9]{4,10}$/;
  return re.test(pincode);
};

export const validateScore = (score, format, options) => {
  if (!score || !format || !options) return false;
  
  const formatOption = options.find(opt => opt.format === format);
  if (!formatOption) return false;
  
  const { min, max } = formatOption;
  return score >= min && score <= max;
};

export const validatePan = (pan) => {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan);
};

export const validateAadhaar = (aadhaar) => {
  const re = /^\d{12}$/;
  return re.test(aadhaar);
};

export const shouldDisplayQuestion = (key, profile) => {
  const question = QUESTION_DETAILS[key];
  if (!question || !question.condition) return true;
  
  const conditions = Array.isArray(question.condition) 
    ? question.condition 
    : [question.condition];
  
  return conditions.every(condition => {
    if (condition.includes("==")) {
      const [field, value] = condition.split("==").map(s => s.trim());
      return profile[field] === value.replace(/['"]/g, "");
    }
    if (condition.includes("!=")) {
      const [field, value] = condition.split("!=").map(s => s.trim());
      return profile[field] !== value.replace(/['"]/g, "");
    }
    if (condition.includes("in")) {
      const [field, values] = condition.split("in").map(s => s.trim());
      const valueList = values.replace(/[\[\]']/g, "").split(",").map(s => s.trim());
      return valueList.includes(profile[field]);
    }
    return true;
  });
};
