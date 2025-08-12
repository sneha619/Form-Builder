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
  Box,
  Tooltip,
  IconButton
} from '@mui/material';
import { useFormState } from '../hooks/useFormStateHook';
import type { FormField, ValidationRule, SelectOption } from '../types/form';
import { 
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Functions as FunctionIcon,
  InfoOutlined
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
    <Card sx={{ 
      position: 'sticky', 
      top: 16, 
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          bgcolor: 'background.paper',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'primary.main', 
              borderRadius: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <SettingsIcon sx={{ fontSize: 18, color: 'primary.contrastText' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Field Configuration</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure {localField.type} field settings
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Basic Properties */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 20, 
                bgcolor: 'primary.main', 
                borderRadius: 1,
                display: 'inline-block'
              }}></Box>
              Basic Properties
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              pl: 2
            }}>
              <TextField
                label="Field Label"
                value={localField.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ label: e.target.value })}
                placeholder="Enter field label"
                size="small"
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
                fullWidth
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localField.required}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ required: e.target.checked })}
                    color="primary"
                  />
                }
                label="Required field"
                sx={{ ml: 0 }}
              />

              {(localField.type === 'text' || localField.type === 'textarea') && (
                <TextField
                  label="Default Value"
                  value={localField.defaultValue as string || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ defaultValue: e.target.value })}
                  placeholder="Enter default value"
                  multiline={localField.type === 'textarea'}
                  rows={localField.type === 'textarea' ? 3 : 1}
                  size="small"
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                  fullWidth
                />
              )}

              {localField.type === 'number' && (
                <TextField
                  label="Default Value"
                  type="number"
                  value={localField.defaultValue || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ defaultValue: e.target.value })}
                  size="small"
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                  fullWidth
                />
              )}

              {localField.type === 'checkbox' && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={localField.defaultValue as boolean || false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField({ defaultValue: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Default checked"
                  sx={{ ml: 0 }}
                />
              )}
            </Box>
          </Box>
        </Box>
        {/* Options for Select/Radio */}
        {(localField.type === 'select' || localField.type === 'radio') && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 6, 
                height: 20, 
                bgcolor: 'primary.main', 
                borderRadius: 1,
                display: 'inline-block'
              }}></Box>
              Field Options
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2 }}>
              {localField.options?.map((option: SelectOption, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}>
                    {index + 1}
                  </Box>
                  <TextField
                    value={option.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateOption(index, 'label', e.target.value)}
                    placeholder="Option label"
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={option.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateOption(index, 'value', e.target.value)}
                    placeholder="Option value"
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleRemoveOption(index)}
                    color="error"
                    sx={{ 
                      minWidth: 32, 
                      width: 32, 
                      height: 32, 
                      p: 0,
                      bgcolor: 'error.lightest', 
                      '&:hover': { bgcolor: 'error.light' }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 12 }} />
                  </Button>
                </Box>
              )) || (
                <Typography variant="body2" color="text.secondary">No options added yet</Typography>
              )}
              <Button 
                startIcon={<AddIcon />} 
                onClick={handleAddOption}
                variant="outlined"
                size="small"
                sx={{ 
                  mt: 1, 
                  borderRadius: 1.5,
                  borderStyle: 'dashed'
                }}
              >
                Add Option
              </Button>
            </Box>
          </Box>
        )}

        {/* Derived Field Configuration */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 6, 
              height: 20, 
              bgcolor: 'primary.main', 
              borderRadius: 1,
              display: 'inline-block'
            }}></Box>
            Advanced Options
          </Typography>
          
          <Box sx={{ pl: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={localField.isDerived || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleDerived(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FunctionIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">Derived Field</Typography>
                  <Tooltip title="A derived field's value is calculated from other fields">
                    <InfoOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
              }
              sx={{ ml: 0 }}
            />

            {localField.isDerived && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.lightest', borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Parent Fields</Typography>
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
                        sx={{ borderRadius: 1.5 }}
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
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 1.5, fontFamily: 'monospace' }
                    }}
                  />
                  <Box sx={{ 
                    p: 2, 
                    mt: 2,
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                      Formula Help
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Use field labels (spaces replaced with underscores) in your formula
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Examples:</strong>
                      <ul style={{ marginTop: 4, paddingLeft: 16 }}>
                        <li>Basic math: <code>Field_1 + Field_2</code></li>
                        <li>Age calculation: <code>calculateAge(Date_of_Birth)</code></li>
                      </ul>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Validation Rules */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 6, 
              height: 20, 
              bgcolor: 'primary.main', 
              borderRadius: 1,
              display: 'inline-block'
            }}></Box>
            Validation Rules
            {localField.isDerived && (
              <Tooltip title="Derived fields cannot have validation rules">
                <InfoOutlined sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
          
          {!localField.isDerived && (
            <Box sx={{ pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">Available Rules</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {validationTypes.map(({ type, label }) => (
                    <Button
                      key={type}
                      variant="outlined"
                      size="small"
                      onClick={() => handleAddValidationRule(type)}
                      disabled={localField.validationRules.some((r: ValidationRule) => r.type === type)}
                      sx={{ fontSize: '0.75rem', height: 28, borderRadius: 1.5 }}
                    >
                      {label}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {localField.validationRules.map((rule: ValidationRule, index: number) => (
                  <Card 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      p: 0, 
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={rule.type} 
                          color="primary" 
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveValidationRule(index)}
                        color="error"
                        sx={{ 
                          bgcolor: 'error.lightest', 
                          '&:hover': { bgcolor: 'error.light' } 
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                      {validationTypes.find(v => v.type === rule.type)?.hasValue && (
                        <TextField
                          label="Value"
                          value={rule.value as string || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateValidationRule(index, { value: e.target.value })}
                          placeholder="Enter value"
                          type={rule.type === 'minLength' || rule.type === 'maxLength' ? 'number' : 'text'}
                          size="small"
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 }
                          }}
                          sx={{ mb: 2 }}
                        />
                      )}

                      <TextField
                        label="Error Message"
                        value={rule.message}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateValidationRule(index, { message: e.target.value })}
                        placeholder="Error message"
                        size="small"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: 1.5 }
                        }}
                      />
                    </Box>
                  </Card>
                ))}

                {localField.validationRules.length === 0 && (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    border: '1px dashed', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      No validation rules added yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FieldConfigPanel;