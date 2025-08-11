export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: string | number;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedField {
  parentFields: string[];
  formula: string; // JavaScript expression
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | boolean;
  validationRules: ValidationRule[];
  options?: SelectOption[]; // For select and radio fields
  isDerived?: boolean;
  derivedField?: DerivedField;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  [fieldId: string]: string | number | boolean | string[] | null;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface FormBuilderState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  currentFormData: FormData;
  validationErrors: ValidationError[];
  isPreviewMode: boolean;
}
