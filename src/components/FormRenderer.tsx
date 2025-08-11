import React from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Box,
  Typography
} from '@mui/material';
import type { FormSchema, FormData, ValidationError } from '../types/form';
import { 
  Error as ErrorIcon,
  Functions as DerivedIcon
} from '@mui/icons-material';

interface FormRendererProps {
  form: FormSchema;
  formData: FormData;
  validationErrors: ValidationError[];
  onFieldChange: (fieldId: string, value: string | number | boolean | string[] | null) => void;
  isPreview?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  form,
  formData,
  validationErrors,
  onFieldChange,
  isPreview = false,
}) => {
  const getFieldError = (fieldId: string) => {
    return validationErrors.find(error => error.fieldId === fieldId);
  };

  const renderField = (field: FormSchema['fields'][number]) => {
    const fieldError = getFieldError(field.id);
    const fieldValue = formData[field.id];

    const fieldContainer = (content: React.ReactNode) => (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body2" component="label" htmlFor={field.id} sx={{ fontWeight: 500 }}>
            {field.label}
            {field.required && <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>}
          </Typography>
          {field.isDerived && (
            <Chip
              icon={<DerivedIcon sx={{ fontSize: 12 }} />}
              label="Derived"
              variant="outlined"
              size="small"
              sx={{ height: 20, fontSize: '0.75rem' }}
            />
          )}
        </Box>
        {content}
        {fieldError && (
          <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
            <Typography variant="body2">{fieldError.message}</Typography>
          </Alert>
        )}
      </Box>
    );

    switch (field.type) {
      case 'text':
        return fieldContainer(
          <TextField
            id={field.id}
            type="text"
            value={fieldValue || ''}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            disabled={field.isDerived}
            placeholder={field.isDerived ? 'Calculated automatically' : 'Enter text...'}
            error={!!fieldError}
            size="small"
            fullWidth
          />
        );

      case 'number':
        return fieldContainer(
          <TextField
            id={field.id}
            type="number"
            value={fieldValue || ''}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            disabled={field.isDerived}
            placeholder={field.isDerived ? 'Calculated automatically' : 'Enter number...'}
            error={!!fieldError}
            size="small"
            fullWidth
          />
        );

      case 'textarea':
        return fieldContainer(
          <TextField
            id={field.id}
            value={fieldValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(field.id, e.target.value)}
            disabled={field.isDerived}
            placeholder={field.isDerived ? 'Calculated automatically' : 'Enter text...'}
            error={!!fieldError}
            multiline
            rows={4}
            size="small"
            fullWidth
          />
        );

      case 'select':
        return fieldContainer(
          <FormControl fullWidth size="small" error={!!fieldError}>
            <InputLabel id={`${field.id}-label`}>
              {field.isDerived ? 'Calculated automatically' : 'Select an option...'}
            </InputLabel>
            <Select
              labelId={`${field.id}-label`}
              id={field.id}
              value={fieldValue || ''}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
              disabled={field.isDerived}
              label={field.isDerived ? 'Calculated automatically' : 'Select an option...'}
            >
              {(field.options || []).map((option: { value: string; label: string }) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return fieldContainer(
          <FormControl component="fieldset" error={!!fieldError}>
            <RadioGroup
              value={fieldValue || ''}
              onChange={(e) => onFieldChange(field.id, e.target.value)}
            >
              {(field.options || []).map((option: { value: string; label: string }) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" disabled={field.isDerived} />}
                  label={option.label}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return fieldContainer(
          <FormControlLabel
            control={
              <Checkbox
                id={field.id}
                checked={Boolean(fieldValue)}
                onChange={(e) => onFieldChange(field.id, e.target.checked)}
                disabled={field.isDerived}
                size="small"
              />
            }
            label={field.isDerived ? 'Calculated automatically' : 'Check this option'}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
          />
        );

      case 'date':
        return fieldContainer(
          <TextField
            id={field.id}
            type="date"
            value={fieldValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(field.id, e.target.value)}
            disabled={field.isDerived}
            error={!!fieldError}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return fieldContainer(
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
            <Typography variant="body2" color="text.secondary">
              Unsupported field type: {field.type}
            </Typography>
          </Box>
        );
    }
  };

  if (!form.fields || form.fields.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ 
          width: 64, 
          height: 64, 
          bgcolor: 'grey.100', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mx: 'auto', 
          mb: 2 
        }}>
          <ErrorIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>No fields to display</Typography>
        <Typography color="text.secondary">
          This form doesn't have any fields yet.
          {isPreview ? ' Go back to the form builder to add fields.' : ''}
        </Typography>
      </Box>
    );
  }

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {form.fields
          .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
          .map((field: FormSchema['fields'][number]) => (
            <Box key={field.id} sx={{ animation: 'fadeIn 0.3s ease-in' }}>
              {renderField(field)}
            </Box>
          ))}

        {/* Form Summary */}
        {isPreview && (
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: 1, 
            borderColor: 'divider', 
            bgcolor: 'grey.50', 
            borderRadius: 1, 
            p: 2 
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Form Summary</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">
                  Total Fields:
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }} component="span">
                  {form.fields.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">
                  Required Fields:
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }} component="span">
                  {form.fields.filter((f: { required: boolean }) => f.required).length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">
                  Derived Fields:
                </Typography>
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }} component="span">
                  {form.fields.filter((f) => Boolean(f.isDerived)).length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">
                  Validation Errors:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ml: 1, 
                    fontWeight: 500,
                    color: validationErrors.length > 0 ? 'error.main' : 'success.main'
                  }} 
                  component="span"
                >
                  {validationErrors.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
};

export default FormRenderer;