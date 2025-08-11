import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Chip, 
  Typography, 
  Box
} from '@mui/material';
import { useFormState } from '../hooks/useFormStateHook';
import type { FormField, ValidationRule, SelectOption } from '../types/form';
import { 
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Functions as FunctionIcon
} from '@mui/icons-material';

interface FieldConfigPanelProps {
  selectedFieldId: string | null;
  onFieldUpdated: () => void;
}

const validationTypes = [
  { type: 'required', label: 'Required', hasValue: false },
  { type: 'notEmpty', label: 'Not Empty', hasValue: false },
  { type: 'minLength', label: 'Minimum Length', hasValue: true },
  { type: 'maxLength', label: 'Maximum Length', hasValue: true },
  { type: 'email', label: 'Email Format', hasValue: false },
  { type: 'password', label: 'Password (8+ chars, 1 number)', hasValue: false },
] as const;

const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({
  selectedFieldId,
}) => {
  const { currentForm, updateField } = useFormState();
  const [localField, setLocalField] = useState<FormField | null>(null);

  const selectedField = currentForm?.fields.find((f: FormField) => f.id === selectedFieldId);

  useEffect(() => {
    if (selectedField) {
      setLocalField({ ...selectedField });
    } else {
      setLocalField(null);
    }
  }, [selectedField]);

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!localField || !selectedFieldId) return;
    
    const updatedField = { ...localField, ...updates };
    setLocalField(updatedField);
    updateField(selectedFieldId, updates);
  };

  const handleAddOption = () => {
    if (!localField) return;
    
    const newOption: SelectOption = {
      label: `Option ${(localField.options?.length || 0) + 1}`,
      value: `option_${(localField.options?.length || 0) + 1}`,
    };
    
    const updatedOptions = [...(localField.options || []), newOption];
    handleUpdateField({ options: updatedOptions });
  };

  const handleUpdateOption = (index: number, field: keyof SelectOption, value: string) => {
    if (!localField || !localField.options) return;
    
    const updatedOptions = [...localField.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    handleUpdateField({ options: updatedOptions });
  };

  const handleRemoveOption = (index: number) => {
    if (!localField || !localField.options) return;
    
    const updatedOptions = localField.options.filter((_option: SelectOption, i: number) => i !== index);
    handleUpdateField({ options: updatedOptions });
  };

  const handleAddValidationRule = (type: ValidationRule['type']) => {
    if (!localField) return;
    
    const ruleConfig = validationTypes.find(v => v.type === type);
    const newRule: ValidationRule = {
      type,
      message: `This field ${type === 'required' ? 'is required' : `must be ${type}`}`,
      value: ruleConfig?.hasValue ? '' : undefined,
    };
    
    const updatedRules = [...localField.validationRules, newRule];
    handleUpdateField({ validationRules: updatedRules });
  };

  const handleUpdateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    if (!localField) return;
    
    const updatedRules = [...localField.validationRules];
    updatedRules[index] = { ...updatedRules[index], ...updates };
    handleUpdateField({ validationRules: updatedRules });
  };

  const handleRemoveValidationRule = (index: number) => {
    if (!localField) return;
    
    const updatedRules = localField.validationRules.filter((_rule: ValidationRule, i: number) => i !== index);
    handleUpdateField({ validationRules: updatedRules });
  };

  const handleToggleDerived = (isDerived: boolean) => {
    if (!localField) return;
    
    handleUpdateField({
      isDerived,
      derivedField: isDerived ? {
        parentFields: [],
        formula: '',
      } : undefined,
    });
  };

  const handleUpdateDerivedField = (field: string, value: string | string[]) => {
    if (!localField || !localField.derivedField) return;
    
    const updatedDerivedField = { ...localField.derivedField, [field]: value };
    handleUpdateField({ derivedField: updatedDerivedField });
  };

  if (!selectedField || !localField) {
    return (
      <Card sx={{ position: 'sticky', top: 16 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <SettingsIcon sx={{ fontSize: 48, mx: 'auto', mb: 3, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>No field selected</Typography>
          <Typography variant="body2" color="text.secondary">
            Select a field from the form builder to configure its properties
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const availableParentFields = currentForm?.fields.filter((f: FormField) =>
    f.id !== localField.id && !f.isDerived
  ) || [];

  return (
    <Card sx={{ position: 'sticky', top: 16 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <SettingsIcon sx={{ fontSize: 20 }} />
          <Typography variant="h6">Field Configuration</Typography>
        </Box>
        {/* Basic Properties */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <TextField
            label="Field Label"
            value={localField.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ label: e.target.value })}
            placeholder="Enter field label"
            size="small"
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={localField.required}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ required: e.target.checked })}
              />
            }
            label="Required field"
          />

          {(localField.type === 'text' || localField.type === 'textarea') && (
            <TextField
              label="Default Value"
              value={localField.defaultValue as string || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ defaultValue: e.target.value })}
              placeholder="Enter default value"
              size="small"
              fullWidth
            />
          )}

          {localField.type === 'checkbox' && (
            <FormControlLabel
              control={
                <Switch
                  checked={localField.defaultValue as boolean || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ defaultValue: e.target.checked })}
                />
              }
              label="Default checked"
            />
          )}
        </Box>

        {/* Options for Select/Radio */}
        {(localField.type === 'select' || localField.type === 'radio') && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2">Options</Typography>
              <Button variant="outlined" size="small" onClick={handleAddOption} startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {localField.options?.map((option: SelectOption, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    value={option.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateOption(index, 'label', e.target.value)}
                    placeholder="Option label"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={option.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateOption(index, 'value', e.target.value)}
                    placeholder="Option value"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleRemoveOption(index)}
                    color="error"
                    sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                  >
                    <DeleteIcon sx={{ fontSize: 12 }} />
                  </Button>
                </Box>
              )) || (
                <Typography variant="body2" color="text.secondary">No options added yet</Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Derived Field Configuration */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localField.isDerived || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleDerived(e.target.checked)}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FunctionIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">Derived Field</Typography>
              </Box>
            }
          />

          {localField.isDerived && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Parent Fields</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableParentFields.map((field: FormField) => (
                      <Button
                      key={field.id}
                      variant={
                        localField.derivedField?.parentFields.includes(field.id) 
                          ? "contained" 
                          : "outlined"
                      }
                      size="small"
                      onClick={() => {
                        const currentParents = localField.derivedField?.parentFields || [];
                        const newParents = currentParents.includes(field.id)
                          ? currentParents.filter((id: string) => id !== field.id)
                          : [...currentParents, field.id];

                        handleUpdateDerivedField('parentFields', newParents);
                      }}
                    >
                      {field.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box>
                <TextField
                  label="Formula"
                  value={localField.derivedField?.formula || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateDerivedField('formula', e.target.value)}
                  placeholder="e.g., calculateAge(Date_of_Birth) or field1 + field2"
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  sx={{ fontFamily: 'monospace' }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Use field labels (spaces replaced with underscores) in your formula
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Validation Rules */}
        {!localField.isDerived && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2">Validation Rules</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {validationTypes.map(({ type, label }) => (
                  <Button
                    key={type}
                    variant="outlined"
                    size="small"
                    onClick={() => handleAddValidationRule(type)}
                    disabled={localField.validationRules.some((r: ValidationRule) => r.type === type)}
                    sx={{ fontSize: '0.75rem', height: 28 }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {localField.validationRules.map((rule: ValidationRule, index: number) => (
                <Box key={index} sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip
                      label={rule.type}
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleRemoveValidationRule(index)}
                      color="error"
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </Button>
                  </Box>

                  {validationTypes.find(v => v.type === rule.type)?.hasValue && (
                    <TextField
                      value={rule.value as string || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateValidationRule(index, { value: e.target.value })}
                      placeholder="Enter value"
                      type={rule.type === 'minLength' || rule.type === 'maxLength' ? 'number' : 'text'}
                      size="small"
                      fullWidth
                    />
                  )}

                  <TextField
                    value={rule.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateValidationRule(index, { message: e.target.value })}
                    placeholder="Error message"
                    size="small"
                    fullWidth
                  />
                </Box>
              ))}

              {localField.validationRules.length === 0 && (
                <Typography variant="body2" color="text.secondary">No validation rules added</Typography>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldConfigPanel;