import React, { memo } from 'react';
import {
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Box,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Text,
} from '@chakra-ui/react';
import { CURRENCY_OPTIONS } from '../../utils/constants';
import { formatAmount } from '../../utils/formatters';

export const TextField = memo(({ value, onChange, type = 'text', helperText, ...props }) => (
  <>
    <Input 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      type={type}
      {...props} 
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </>
));

export const ChoiceField = memo(({ value, onChange, options, placeholder = 'Select...', helperText, ...props }) => (
  <>
    <Select 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      {...props}
    >
      {options?.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </Select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </>
));

export const ScoreFormatCombo = memo(({ value, onChange, options, helperText, ...props }) => {
  // Ensure value is an object
  const safeValue = value || {};
  
  // Find the selected format option
  const selectedOption = safeValue.format ? 
    options?.find(opt => opt.format === safeValue.format) : null;
  
  return (
    <Box>
      <Select
        value={safeValue.format || ''}
        onChange={e => onChange({ format: e.target.value, value: safeValue.value })}
        mb={2}
        {...props}
      >
        <option value="">Select Format...</option>
        {options?.map(opt => (
          <option key={opt.format} value={opt.format}>{opt.format}</option>
        ))}
      </Select>
      {safeValue.format && (
        <>
          <NumberInput
            value={safeValue.value || ''}
            onChange={val => {
              const parsedVal = val === '' ? null : parseFloat(val);
              onChange({ format: safeValue.format, value: parsedVal });
            }}
            min={selectedOption?.range?.min}
            max={selectedOption?.range?.max}
          >
            <NumberInputField 
              placeholder={
                safeValue.format === 'Percentage' ? '0-100' :
                safeValue.format === 'CGPA' ? '0-10' : 
                'Enter score'
              }
            />
          </NumberInput>
          {selectedOption && (
            <FormHelperText>
              Valid range: {selectedOption.range.min} - {selectedOption.range.max}
            </FormHelperText>
          )}
        </>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Box>
  );
});

export const TestScoreCombo = memo(({ value, onChange, options, helperText, ...props }) => {
  // Ensure value is an object
  const safeValue = value || {};
  
  // Find the selected test option
  const selectedOption = safeValue.type && safeValue.type !== 'None' ? 
    options?.find(opt => opt.type === safeValue.type) : null;
  
  return (
    <Box>
      <Select
        value={safeValue.type || ''}
        onChange={e => {
          const newType = e.target.value;
          // Clear score if "None" is selected
          const newScore = newType === 'None' ? null : safeValue.score;
          onChange({ type: newType, score: newScore });
        }}
        mb={2}
        {...props}
      >
        <option value="">Select Test...</option>
        {options?.map(opt => (
          <option key={opt.type} value={opt.type}>{opt.type}</option>
        ))}
      </Select>
      {safeValue.type && safeValue.type !== 'None' && (
        <>
          <NumberInput
            value={safeValue.score || ''}
            onChange={val => {
              const parsedVal = val === '' ? null : parseFloat(val);
              onChange({ type: safeValue.type, score: parsedVal });
            }}
            min={selectedOption?.range?.min}
            max={selectedOption?.range?.max}
          >
            <NumberInputField 
              placeholder={
                safeValue.type === 'IELTS' ? '0-9' :
                safeValue.type === 'TOEFL' ? '0-120' :
                safeValue.type === 'PTE' ? '10-90' :
                safeValue.type === 'GRE' ? '260-340' :
                safeValue.type === 'GMAT' ? '200-800' :
                'Enter score'
              }
            />
          </NumberInput>
          {selectedOption && (
            <FormHelperText>
              Valid range: {selectedOption.range.min} - {selectedOption.range.max}
            </FormHelperText>
          )}
        </>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Box>
  );
});

export const AmountCurrencyField = memo(({ value, onChange, helperText, ...props }) => {
  // Ensure value is an object
  const safeValue = value || {};
  
  return (
    <Box>
      <HStack mb={2}>
        <NumberInput
          value={safeValue.amount || ''}
          onChange={val => {
            const parsedVal = val === '' ? null : parseFloat(val);
            onChange({ ...safeValue, amount: parsedVal });
          }}
          flex={1}
          min={0}
          {...props}
        >
          <NumberInputField placeholder="Enter amount" />
        </NumberInput>
        <Select
          value={safeValue.currency || 'INR'}
          onChange={e => onChange({ ...safeValue, currency: e.target.value })}
          width="120px"
        >
          {CURRENCY_OPTIONS.map(curr => (
            <option key={curr} value={curr}>{curr}</option>
          ))}
        </Select>
      </HStack>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {safeValue.amount && (
        <Text fontSize="sm" color="blue.600">
          {formatAmount(
            safeValue.currency === 'USD' ? safeValue.amount * 83 : safeValue.amount,
            'INR'
          )}
        </Text>
      )}
    </Box>
  );
});

export const CourseDurationField = memo(({ value, onChange, options, helperText, ...props }) => {
  // Ensure value is an object
  const safeValue = value || {};
  
  return (
    <Box>
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Years</FormLabel>
          <Select
            value={safeValue.years || ''}
            onChange={e => onChange({ ...safeValue, years: e.target.value })}
          >
            <option value="">Select...</option>
            {options?.[0]?.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Months</FormLabel>
          <Select
            value={safeValue.months || ''}
            onChange={e => onChange({ ...safeValue, months: e.target.value })}
          >
            <option value="">Select...</option>
            {options?.[1]?.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </Select>
        </FormControl>
      </HStack>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Box>
  );
});

// Simple currency conversion helper (in a real app, use an API)
const getCurrencyRate = (currency) => {
  const rates = {
    'USD': 83.5,
    'EUR': 90.2,
    'GBP': 105.8,
    'CAD': 61.5,
    'INR': 1
  };
  return rates[currency] || 1;
};