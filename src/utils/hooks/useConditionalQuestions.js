import { useMemo } from 'react';
import { QUESTION_DETAILS } from '../constants';

export const useConditionalQuestions = (key, data) => {
  return useMemo(() => {
    const question = QUESTION_DETAILS[key];
    if (!question || !question.condition) return true;
    
    if (Array.isArray(question.condition)) {
      return question.condition.every(cond => evaluateCondition(cond, data));
    }
    
    return evaluateCondition(question.condition, data);
  }, [key, data]);
};

const evaluateCondition = (condition, data) => {
  if (condition.includes('==')) {
    const [field, value] = condition.split('==').map(s => s.trim());
    const fieldValue = getNestedValue(data, field);
    return fieldValue === value.replace(/['"]/g, '');
  }
  
  if (condition.includes('!=')) {
    const [field, value] = condition.split('!=').map(s => s.trim());
    const fieldValue = getNestedValue(data, field);
    return fieldValue !== value.replace(/['"]/g, '');
  }
  
  if (condition.includes('in')) {
    const [field, values] = condition.split('in').map(s => s.trim());
    const fieldValue = getNestedValue(data, field);
    const valueList = values.replace(/[\[\]']/g, '').split(',').map(s => s.trim());
    return valueList.includes(fieldValue);
  }
  
  return true;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};
