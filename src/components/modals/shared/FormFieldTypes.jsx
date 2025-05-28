import React from 'react';
import {
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Box,
  HStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react';
import { CURRENCY_OPTIONS } from '../../../utils/constants';

export const TextField = ({ value, onChange, ...props }) => (
  <Input value={value || ''} onChange={e => onChange(e.target.value)} {...props} />
);

export const ChoiceField = ({ value, onChange, options, ...props }) => (
  <Select value={value || ''} onChange={e => onChange(e.target.value)} {...props}>
    <option value="">Select...</option>
    {options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </Select>
);

export const ScoreFormatCombo = ({ value, onChange, options, ...props }) => (
  <Box>
    <Select
      value={value?.format || ''}
      onChange={e => onChange({ format: e.target.value, value: value?.value })}
      mb={2}
      {...props}
    >
      <option value="">Select Format...</option>
      {options.map(opt => (
        <option key={opt.format} value={opt.format}>{opt.format}</option>
      ))}
    </Select>
    {value?.format && (
      <NumberInput
        value={value.value || ''}
        onChange={val => onChange({ format: value.format, value: parseFloat(val) })}
        min={options.find(opt => opt.format === value.format)?.range?.min}
        max={options.find(opt => opt.format === value.format)?.range?.max}
      >
        <NumberInputField />
      </NumberInput>
    )}
  </Box>
);

export const TestScoreCombo = ({ value, onChange, options, ...props }) => (
  <Box>
    <Select
      value={value?.type || ''}
      onChange={e => onChange({ type: e.target.value, score: null })}
      mb={2}
      {...props}
    >
      <option value="">Select Test...</option>
      {options.map(opt => (
        <option key={opt.type} value={opt.type}>{opt.type}</option>
      ))}
    </Select>
    {value?.type && value.type !== 'None' && (
      <NumberInput
        value={value.score || ''}
        onChange={val => onChange({ type: value.type, score: parseFloat(val) })}
        min={options.find(opt => opt.type === value.type)?.range?.min}
        max={options.find(opt => opt.type === value.type)?.range?.max}
      >
        <NumberInputField />
      </NumberInput>
    )}
  </Box>
);

export const AmountCurrencyField = ({ value, onChange, ...props }) => (
  <Box>
    <HStack mb={2}>
      <NumberInput
        value={value?.amount || ''}
        onChange={val => onChange({ ...value, amount: parseFloat(val) })}
        flex={1}
      >
        <NumberInputField placeholder="Enter amount" />
      </NumberInput>
      <Select
        value={value?.currency || 'INR'}
        onChange={e => onChange({ ...value, currency: e.target.value })}
        width="120px"
      >
        {CURRENCY_OPTIONS.map(curr => (
          <option key={curr} value={curr}>{curr}</option>
        ))}
      </Select>
    </HStack>
  </Box>
);

export const CourseDurationField = ({ value, onChange, options, ...props }) => (
  <HStack spacing={4}>
    <FormControl>
      <FormLabel>Years</FormLabel>
      <Select
        value={value?.years || ''}
        onChange={e => onChange({ ...value, years: e.target.value })}
      >
        <option value="">Select...</option>
        {options[0].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </Select>
    </FormControl>
    <FormControl>
      <FormLabel>Months</FormLabel>
      <Select
        value={value?.months || ''}
        onChange={e => onChange({ ...value, months: e.target.value })}
      >
        <option value="">Select...</option>
        {options[1].map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </Select>
    </FormControl>
  </HStack>
);
