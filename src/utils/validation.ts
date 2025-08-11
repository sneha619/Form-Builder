import type { FormField, FormData, ValidationError } from '../types/form';

export const validateField = (field: FormField, value: string | number | boolean | Date | null | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  for (const rule of field.validationRules) {
    let isValid = true;
    const errorMessage = rule.message;

    switch (rule.type) {
      case 'required':
        if (field.type === 'checkbox') {
          isValid = value === true;
        } else {
          isValid = value !== null && value !== undefined && value !== '';
        }
        break;
        
      case 'notEmpty':
        isValid = value !== null && value !== undefined && String(value).trim() !== '';
        break;
        
      case 'minLength':
        if (value && rule.value) {
          isValid = String(value).length >= Number(rule.value);
        }
        break;
        
      case 'maxLength':
        if (value && rule.value) {
          isValid = String(value).length <= Number(rule.value);
        }
        break;
        
      case 'email':
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailRegex.test(String(value));
        }
        break;
        
      case 'password':
        if (value) {
          // Password must be at least 8 characters and contain a number
          const password = String(value);
          isValid = password.length >= 8 && /\d/.test(password);
        }
        break;
        
      default:
        break;
    }

    if (!isValid) {
      errors.push({
        fieldId: field.id,
        message: errorMessage,
      });
    }
  }

  return errors;
};

export const validateForm = (fields: FormField[], formData: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  for (const field of fields) {
    if (!field.isDerived) { // Don't validate derived fields directly
      const fieldErrors = validateField(field, formData[field.id] as string | number | boolean | Date | null);
      errors.push(...fieldErrors);
    }
  }
  
  return errors;
};

export const calculateDerivedField = (
  field: FormField,
  formData: FormData,
  allFields: FormField[]
): string | number | Date | null => {
  if (!field.isDerived || !field.derivedField) {
    return null;
  }

  try {
    // Create a safe context for formula evaluation
    const context: { [key: string]: string | number | Date | null } = {};
    
    // Add parent field values to context
    for (const parentFieldId of field.derivedField.parentFields) {
      const parentField = allFields.find(f => f.id === parentFieldId);
      if (parentField) {
        const fieldValue = formData[parentFieldId];
        // Convert boolean/array values to string/number to match context type constraints
        context[parentField.label.replace(/\s+/g, '_')] = typeof fieldValue === 'boolean' || Array.isArray(fieldValue) 
          ? String(fieldValue)
          : fieldValue as string | number | Date | null;
      }
    }
    
    // Add some helper functions
    const mathContext = {
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      max: Math.max,
      min: Math.min,
      pow: Math.pow,
      sqrt: Math.sqrt
    };
    Object.assign(context, mathContext);
    // Provide a safe Date constructor wrapper that returns null on invalid dates
    // Add functions as wrappers that return values of the expected type
    context.parseDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };
    
    // Wrap parseInt and parseFloat to return values instead of functions
    context.parseInt = (str: string, radix?: number) => parseInt(str, radix);
    context.parseFloat = (str: string) => parseFloat(str);
    
    // Simple age calculation example
    if (field.derivedField.formula.includes('calculateAge')) {
      const dateOfBirth = Object.values(context)[0];
      if (dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
    }
    
    // For other formulas, use Function constructor (in a real app, you'd want a safer evaluator)
    const func = new Function(...Object.keys(context), `return ${field.derivedField.formula}`);
    return func(...Object.values(context));
  } catch (error) {
    console.error('Error calculating derived field:', error);
    return 'Error';
  }
};