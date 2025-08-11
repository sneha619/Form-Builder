import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { FormSchema, FormField, FormData, ValidationError, FieldType } from '../types/form';
import { loadFormsFromStorage, saveFormToStorage, deleteFormFromStorage } from '../utils/localStorage';

interface FormState {
  currentForm: FormSchema | null;
  currentFormData: FormData;
  validationErrors: ValidationError[];
  isPreviewMode: boolean;
  savedForms: FormSchema[];
}

interface FormActions {
  // Form management
  createNewForm: () => void;
  loadForm: (formId: string) => void;
  updateFormName: (name: string) => void;
  saveCurrentForm: () => Promise<boolean>;
  clearCurrentForm: () => void;
  deleteForm: (formId: string) => void;
  
  // Field management
  addField: (type: FieldType) => FormField;
  updateField: (id: string, field: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  
  // Form data management
  updateFormData: (fieldId: string, value: string | number | boolean | string[] | null) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  
  // Preview mode
  setPreviewMode: (isPreview: boolean) => void;
  
  // Refresh saved forms
  refreshSavedForms: () => void;
}

const FormStateContext = createContext<(FormState & FormActions) | null>(null);

// Hook moved to useFormStateHook.ts
export { FormStateContext };

interface FormStateProviderProps {
  children: ReactNode;
}

export const FormStateProvider: React.FC<FormStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<FormState>({
    currentForm: null,
    currentFormData: {},
    validationErrors: [],
    isPreviewMode: false,
    savedForms: [],
  });

  // Load saved forms on mount
  useEffect(() => {
    const savedForms = loadFormsFromStorage();
    setState(prev => ({ ...prev, savedForms }));
  }, []);

  const createNewForm = () => {
    const newForm: FormSchema = {
      id: `form_${Date.now()}`,
      name: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      currentForm: newForm,
      currentFormData: {},
      validationErrors: [],
      isPreviewMode: false,
    }));
  };

  const loadForm = (formId: string) => {
    const form = state.savedForms.find(f => f.id === formId);
    if (form) {
      setState(prev => ({
        ...prev,
        currentForm: { ...form },
        currentFormData: {},
        validationErrors: [],
        isPreviewMode: false,
      }));
    }
  };

  const updateFormName = (name: string) => {
    if (state.currentForm) {
      setState(prev => ({
        ...prev,
        currentForm: {
          ...prev.currentForm!,
          name,
          updatedAt: new Date().toISOString(),
        }
      }));
    }
  };

  const saveCurrentForm = async (): Promise<boolean> => {
    if (!state.currentForm?.name?.trim()) {
      return false;
    }

    try {
      saveFormToStorage(state.currentForm);
      
      // Update saved forms list
      const updatedSavedForms = [...state.savedForms];
      const existingIndex = updatedSavedForms.findIndex(f => f.id === state.currentForm!.id);
      
      if (existingIndex !== -1) {
        updatedSavedForms[existingIndex] = { ...state.currentForm };
      } else {
        updatedSavedForms.push({ ...state.currentForm });
      }

      setState(prev => ({
        ...prev,
        savedForms: updatedSavedForms,
      }));

      return true;
    } catch (error) {
      console.error('Failed to save form:', error);
      return false;
    }
  };

  const clearCurrentForm = () => {
    setState(prev => ({
      ...prev,
      currentForm: null,
      currentFormData: {},
      validationErrors: [],
      isPreviewMode: false,
    }));
  };

  const deleteForm = (formId: string) => {
    deleteFormFromStorage(formId);
    setState(prev => ({
      ...prev,
      savedForms: prev.savedForms.filter(f => f.id !== formId),
    }));
  };

  const addField = (type: FieldType): FormField => {
    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validationRules: [],
      order: state.currentForm?.fields.length || 0,
    };

    if (state.currentForm) {
      setState(prev => ({
        ...prev,
        currentForm: {
          ...prev.currentForm!,
          fields: [...prev.currentForm!.fields, newField],
          updatedAt: new Date().toISOString(),
        }
      }));
    }

    return newField;
  };

  const updateField = (id: string, field: Partial<FormField>) => {
    if (state.currentForm) {
      const fieldIndex = state.currentForm.fields.findIndex((f: FormField) => f.id === id);
      if (fieldIndex !== -1) {
        const updatedFields = [...state.currentForm.fields];
        updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], ...field };
        
        setState(prev => ({
          ...prev,
          currentForm: {
            ...prev.currentForm!,
            fields: updatedFields,
            updatedAt: new Date().toISOString(),
          }
        }));
      }
    }
  };

  const removeField = (fieldId: string) => {
    if (state.currentForm) {
      const updatedFields = state.currentForm.fields.filter((f: FormField) => f.id !== fieldId);
      const updatedFormData = { ...state.currentFormData };
      delete updatedFormData[fieldId];
      const updatedErrors = state.validationErrors.filter(e => e.fieldId !== fieldId);

      setState(prev => ({
        ...prev,
        currentForm: {
          ...prev.currentForm!,
          fields: updatedFields,
          updatedAt: new Date().toISOString(),
        },
        currentFormData: updatedFormData,
        validationErrors: updatedErrors,
      }));
    }
  };

  const updateFormData = (fieldId: string, value: string | number | boolean | string[] | null) => {
    setState(prev => ({
      ...prev,
      currentFormData: {
        ...prev.currentFormData,
        [fieldId]: value,
      },
      validationErrors: prev.validationErrors.filter(e => e.fieldId !== fieldId),
    }));
  };

  const setValidationErrors = (errors: ValidationError[]) => {
    setState(prev => ({
      ...prev,
      validationErrors: errors,
    }));
  };

  const setPreviewMode = (isPreview: boolean) => {
    setState(prev => ({
      ...prev,
      isPreviewMode: isPreview,
      currentFormData: isPreview ? {} : prev.currentFormData,
      validationErrors: isPreview ? [] : prev.validationErrors,
    }));
  };

  const refreshSavedForms = () => {
    const savedForms = loadFormsFromStorage();
    setState(prev => ({ ...prev, savedForms }));
  };

  const value = {
    ...state,
    createNewForm,
    loadForm,
    updateFormName,
    saveCurrentForm,
    clearCurrentForm,
    deleteForm,
    addField,
    updateField,
    removeField,
    updateFormData,
    setValidationErrors,
    setPreviewMode,
    refreshSavedForms,
  };

  return (
    <FormStateContext.Provider value={value}>
      {children}
    </FormStateContext.Provider>
  );
};