import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createCustomStorage } from '../utils/storage';

const modalOrder = ['basic_info', 'education', 'study_plan', 'tests', 'collateral', 'identification', 'dashboard'];

const initialState = {
  currentModal: null,
  isLoading: false,
  error: null,
  studentProfile: {
    basic_info: {},
    education_details: {},
    loan_details: {},
    co_applicant_details: {}
  },
  vendorMatches: [],
  documentList: null,
  supportedVendors: []
};

export const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Modal navigation
        setCurrentModal: (modal) => set({ currentModal: modal }, false, 'setCurrentModal'),
        
        // Loading state
        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
        
        // Error handling
        setError: (error) => set({ 
          error: typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'
        }, false, 'setError'),
        
        resetErrors: () => set({ error: null }, false, 'resetErrors'),
        
        // Navigation
        goBack: () => set((state) => {
          const currentIndex = modalOrder.indexOf(state.currentModal);
          const previousModal = modalOrder[currentIndex - 1];
          return { currentModal: previousModal || state.currentModal };
        }, false, 'goBack'),
        
        goNext: () => set((state) => {
          const currentIndex = modalOrder.indexOf(state.currentModal);
          const nextModal = modalOrder[currentIndex + 1];
          return nextModal ? { currentModal: nextModal } : state;
        }, false, 'goNext'),
        
        // Profile updates
        updateProfile: (section, key, value) => set((state) => {
          // Handle different update patterns
          if (!section) {
            // Update root level property
            return { 
              studentProfile: { ...state.studentProfile, [key]: value }
            };
          } else if (!key) {
            // Update entire section
            return {
              studentProfile: {
                ...state.studentProfile,
                [section]: { ...(state.studentProfile[section] || {}), ...value }
              }
            };
          } else {
            // Update specific field in section
            return {
              studentProfile: {
                ...state.studentProfile,
                [section]: {
                  ...(state.studentProfile[section] || {}),
                  [key]: value
                }
              }
            };
          }
        }, false, 'updateProfile'),
        
        // Set student ID after profile creation
        setStudentId: (id) => set((state) => ({
          studentProfile: { ...state.studentProfile, student_id: id }
        }), false, 'setStudentId'),
        
        // Results management
        setVendorMatches: (matches) => set({ vendorMatches: matches }, false, 'setVendorMatches'),
        
        setDocumentList: (list) => set({ documentList: list }, false, 'setDocumentList'),
        
        setSupportedVendors: (vendors) => set({ supportedVendors: vendors }, false, 'setSupportedVendors'),
        
        // Reset functions
        resetStore: () => set(initialState, false, 'resetStore'),
        
        resetSection: (section) => set((state) => ({
          studentProfile: {
            ...state.studentProfile,
            [section]: {}
          }
        }), false, 'resetSection'),
        
        // Helper functions
        getCompleteProfile: () => get().studentProfile,
        
        // Async action wrapper with loading and error handling
        withLoadingAndErrorHandling: async (action, actionName) => {
          const { setLoading, setError, resetErrors } = get();
          try {
            setLoading(true);
            resetErrors();
            const result = await action();
            return result;
          } catch (error) {
            console.error(`Error in ${actionName}:`, error);
            setError(error);
            return null;
          } finally {
            setLoading(false);
          }
        }
      }),
      {
        name: 'loan-assistant-storage',
        storage: createCustomStorage(),
        partialize: (state) => ({
          studentProfile: state.studentProfile,
          vendorMatches: state.vendorMatches,
          documentList: state.documentList
        })
      }
    )
  )
);

// Helper hook for async actions with loading and error handling
export const useAsyncAction = (action, actionName) => {
  const { withLoadingAndErrorHandling } = useStore();
  
  return async (...args) => {
    return await withLoadingAndErrorHandling(
      () => action(...args),
      actionName
    );
  };
};