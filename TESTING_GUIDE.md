# Testing Guide for LoanMonk Storage Implementation

This guide helps you test the storage implementation to ensure it works correctly.

## What to Test

1. **24-hour persistence for BasicInfo and Education:**
   - Data entered in BasicInfo and Education modals should persist for 24 hours
   - Other modal data should be cleared on page reload

2. **Conditional Field Rendering:**
   - In EducationModal, the "education_gap_duration" field should only appear when "education_gap" is set to "Yes"
   - In EducationModal, the "yearly_income" field should only appear when "current_profession" is "Employed" or "Self-Employed"

3. **Duplicate ID Prevention:**
   - IdentificationModal should prevent submission when student and co-applicant have same PAN or Aadhaar numbers

## How to Test

### Using Developer Tools

There's a developer tools panel (gear icon) in the bottom-right corner that provides testing utilities:

1. **Test Storage Button:**
   - Shows the current state of both localStorage and sessionStorage
   - Check console for detailed output

2. **Simulate Expiration Button:**
   - Sets the expiration time to 1 minute from now
   - After 1 minute, reload the page to see if cleanup works

3. **Force Clear Storage Button:**
   - Manually clears all storage data
   - Use this to start with a clean slate

### Storage Persistence Test

1. Enter data in the BasicInfo modal and proceed to Education
2. Enter data in the Education modal and proceed further
3. Close the browser or reload the page
4. Open the application again - BasicInfo and Education data should still be there
5. Use "Simulate Expiration" to test 24-hour expiration (accelerated to 1 minute)

### Conditional Field Test

1. In EducationModal:
   - Select "No" for education gap - duration field should be hidden
   - Select "Yes" - duration field should appear
   - Select "Student" for profession - income field should be hidden
   - Select "Employed" - income field should appear

### Duplicate ID Test

1. In IdentificationModal:
   - Enter the same PAN number for student and co-applicant - error should appear
   - Enter the same Aadhaar number - error should appear
   - Submit button should be disabled when duplicates exist

## Debugging

- Check the browser console for detailed logs
- Storage tests show timestamps for when data will expire
- The EducationModal logs conditional field visibility

## Expected Behavior

- Basic info and education data persists for 24 hours
- Other modal data is cleared on page reload
- Fields show/hide based on conditions
- Cannot submit with duplicate identification numbers
