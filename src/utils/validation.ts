import type { FormField, FormData, ValidationError } from '../types/form';

export const validateField = (
  field: FormField,
  value: string | number | boolean | Date | null | undefined
): ValidationError[] => {
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
    if (!field.isDerived) {
      const fieldErrors = validateField(
        field,
        formData[field.id] as string | number | boolean | Date | null
      );
      errors.push(...fieldErrors);
    }
  }

  return errors;
};

export const calculateDerivedField = (
  field: FormField,
  formData: FormData,
  allFields: FormField[]
): string | number | null => {
  if (!field.isDerived || !field.derivedField) {
    return null;
  }

  try {
    // Context can hold values or helper functions
    const context: { [key: string]: string | number | null | ((value: string | number | null, ...args: (string | number)[]) => string | number | null) } = {};

    // Add parent field values
    for (const parentFieldId of field.derivedField.parentFields) {
      const parentField = allFields.find(f => f.id === parentFieldId);
      if (parentField) {
        const fieldValue = formData[parentFieldId];
        context[parentField.label.replace(/\s+/g, '_')] =
          typeof fieldValue === 'boolean' || Array.isArray(fieldValue)
            ? String(fieldValue)
            : (fieldValue as string | number | null);
      }
    }

    // Math helpers
    const mathContext = {
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      max: Math.max,
      min: Math.min,
      pow: Math.pow,
      sqrt: Math.sqrt,
    };
    Object.assign(context, mathContext);

    // Safe date parser
    context.parseDate = (value: string | number | null): number | null => {
      if (value === null) return null;
      const date = new Date(value as string | number);
      return isNaN(date.getTime()) ? null : date.getTime();
    };

    // Safe parseInt and parseFloat wrappers
    context.parseInt = (value: string | number | null, radix?: string | number): string | number | null => {
      if (value === null || value === undefined) return null;
      const result = Number.parseInt(String(value), Number(radix) || undefined);
      return isNaN(result) ? null : result;
    };

    context.parseFloat = (value: string | number | null): string | number | null => {
      if (value === null || value === undefined) return null;
      const result = Number.parseFloat(String(value));
      return isNaN(result) ? null : result;
    };


    // Example: Age calculation
    if (field.derivedField.formula.includes('calculateAge')) {
      const dateOfBirth = Object.values(context)[0];
      if (dateOfBirth && typeof dateOfBirth === 'string') {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (!isNaN(birthDate.getTime())) {
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age;
        }
      }
      return null;
    }

    // Evaluate formula
    const func = new Function(...Object.keys(context), `return ${field.derivedField.formula}`);
    return func(...Object.values(context));
  } catch (error) {
    console.error('Error calculating derived field:', error);
    return 'Error' as string;
  }
};
