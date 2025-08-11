import { FormSchema } from '../types/form';

const FORMS_STORAGE_KEY = 'form-builder-forms';

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(FORMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load forms from storage:', error);
    return [];
  }
};

export const saveFormToStorage = (form: FormSchema): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const formIndex = existingForms.findIndex(f => f.id === form.id);
    
    if (formIndex !== -1) {
      existingForms[formIndex] = form;
    } else {
      existingForms.push(form);
    }
    
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(existingForms));
  } catch (error) {
    console.error('Failed to save form to storage:', error);
    throw error;
  }
};

export const deleteFormFromStorage = (formId: string): void => {
  try {
    const existingForms = loadFormsFromStorage();
    const filteredForms = existingForms.filter(f => f.id !== formId);
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(filteredForms));
  } catch (error) {
    console.error('Failed to delete form from storage:', error);
    throw error;
  }
};

export const getFormFromStorage = (formId: string): FormSchema | null => {
  try {
    const forms = loadFormsFromStorage();
    return forms.find(f => f.id === formId) || null;
  } catch (error) {
    console.error('Failed to get form from storage:', error);
    return null;
  }
};