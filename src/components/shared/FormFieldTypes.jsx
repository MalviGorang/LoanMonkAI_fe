import React, { memo, useState, useEffect } from 'react';
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
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { CURRENCY_OPTIONS } from '../../utils/constants';
import { formatAmount } from '../../utils/formatters';

export const TextField = memo(({ value, onChange, type = 'text', helperText, onKeyDown, ...props }) => (
  <>
    <Input 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      type={type}
      onKeyDown={onKeyDown}
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

// Searchable dropdown component
export const SearchableChoiceField = memo(({ value, onChange, options, placeholder = 'Search...', helperText, onBlur, ...props }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = React.useRef(null);
  const itemRefs = React.useRef({});
  
  // Filter options when search term changes
  useEffect(() => {
    if (!options) return;
    
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    
    // Reset selection index when options change
    setSelectedIndex(-1);
  }, [searchTerm, options]);
  
  // Scroll selected item into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current && itemRefs.current[selectedIndex]) {
      const list = listRef.current;
      const item = itemRefs.current[selectedIndex];
      
      // Calculate if item is outside visible area of the container
      const listRect = list.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      // Check if item is outside the visible area
      if (itemRect.bottom > listRect.bottom) {
        // Use scrollTop to control scrolling within the container only
        list.scrollTop = list.scrollTop + (itemRect.bottom - listRect.bottom);
      } else if (itemRect.top < listRect.top) {
        // Use scrollTop to control scrolling within the container only
        list.scrollTop = list.scrollTop - (listRect.top - itemRect.top);
      }
    }
  }, [selectedIndex]);
  
  // Handle option selection
  const handleSelect = (option) => {
    onChange(option);
    setShowDropdown(false);
    setSearchTerm('');
    setIsSearchMode(false);
  };
  
  // Handle input click to make value editable
  const handleInputClick = () => {
    if (value && !isSearchMode) {
      setIsSearchMode(true);
      setSearchTerm(value); // Set search term to current value instead of clearing
    }
    setShowDropdown(true);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setShowDropdown(true);
        e.preventDefault(); // Stop default scrolling behavior
        e.stopPropagation(); // Stop event from bubbling up
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Stop default scrolling behavior
        e.stopPropagation(); // Stop event from bubbling up
        setSelectedIndex(prevIndex => {
          const newIndex = prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex;
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault(); // Stop default scrolling behavior
        e.stopPropagation(); // Stop event from bubbling up
        setSelectedIndex(prevIndex => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
          return newIndex;
        });
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[selectedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        break;
        
      default:
        break;
    }
  };
  
  return (
    <Box position="relative" {...props}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          value={isSearchMode ? searchTerm : (value || '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearchMode(true);
            if (!showDropdown) setShowDropdown(true);
            // Only clear the selection if input is completely empty
            if (e.target.value === '' && value) {
              onChange('');
            }
          }}
          placeholder={placeholder}
          onFocus={handleInputClick}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Delay hiding to allow for click on options
            setTimeout(() => {
              setShowDropdown(false);
              
              // If user was searching but didn't select anything from dropdown
              if (isSearchMode) {
                // If search term exactly matches an option, select it
                const exactMatch = options?.find(opt => 
                  opt.toLowerCase() === searchTerm.toLowerCase()
                );
                
                if (exactMatch) {
                  onChange(exactMatch);
                } else if (searchTerm.trim() !== '') {
                  // If there's text but no exact match, we keep the search term as the value
                  // This allows free text entry if desired
                  onChange(searchTerm);
                }
                
                setIsSearchMode(false);
              }
              
              // Call the parent's onBlur if provided
              if (typeof onBlur === 'function') {
                onBlur();
              }
            }, 200);
          }}
        />
      </InputGroup>
      
      {showDropdown && filteredOptions.length > 0 && (
        <List
          position="absolute"
          zIndex="10"
          bg="white"
          width="100%"
          boxShadow="md"
          borderRadius="md"
          mt="2px"
          maxH="200px"
          overflowY="auto"
          ref={listRef}
        >
          {filteredOptions.map((option, index) => (
            <ListItem
              key={option}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: "blue.50" }}
              onClick={() => handleSelect(option)}
              fontWeight={(option === value || index === selectedIndex) ? "bold" : "normal"}
              bg={(option === value || index === selectedIndex) ? "blue.50" : "white"}
              ref={el => itemRefs.current[index] = el}
            >
              {option}
            </ListItem>
          ))}
        </List>
      )}
      
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </Box>
  );
});