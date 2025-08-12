import React from 'react';
import { Card, CardContent, Button, Chip, Typography, Box } from '@mui/material';
import { useFormState } from '../hooks/useFormStateHook';
import type { FieldType, FormField } from '../types/form';
import { 
  Add as Plus,
  Delete as Trash2,
  DragIndicator as GripVertical,
  TextFields as Type,
  Numbers as Hash,
  Description as FileText,
  ExpandMore as ChevronDown,
  RadioButtonUnchecked as Circle,
  CheckBoxOutlineBlank as Square,
  CalendarToday as Calendar
} from '@mui/icons-material';

interface FormBuilderPanelProps {
  onAddField: (type: FieldType) => void;
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
}

const fieldTypeConfig = {
  text: { label: 'Text Input', icon: <Type className="w-4 h-4" /> },
  number: { label: 'Number Input', icon: <Hash className="w-4 h-4" /> },
  textarea: { label: 'Text Area', icon: <FileText className="w-4 h-4" /> },
  select: { label: 'Select Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
  radio: { label: 'Radio Button', icon: <Circle className="w-4 h-4" /> },
  checkbox: { label: 'Checkbox', icon: <Square className="w-4 h-4" /> },
  date: { label: 'Date Picker', icon: <Calendar className="w-4 h-4" /> },
};

const FormBuilderPanel: React.FC<FormBuilderPanelProps> = ({
  onAddField,
  selectedFieldId,
  onSelectField,
}) => {
  const { currentForm, removeField } = useFormState();

  const handleDeleteField = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this field?')) {
      removeField(fieldId);
      if (selectedFieldId === fieldId) {
        onSelectField(null);
      }
    }
  };

  const getFieldPreview = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return <div className="h-8 bg-form-field-bg border border-form-field-border rounded px-3 py-1.5 text-sm text-muted-foreground">Enter {field.type}...</div>;
      case 'textarea':
        return <div className="h-16 bg-form-field-bg border border-form-field-border rounded px-3 py-1.5 text-sm text-muted-foreground">Enter text...</div>;
      case 'select':
        return (
          <div className="h-8 bg-form-field-bg border border-form-field-border rounded px-3 py-1.5 text-sm text-muted-foreground flex items-center justify-between">
            Select an option...
            <ChevronDown className="w-4 h-4" />
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {(field.options || [{ label: 'Option 1', value: '1' }]).slice(0, 2).map((option: { label: string; value: string }, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-form-field-border rounded-full" />
                <span className="text-sm text-muted-foreground">{option.label}</span>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border border-form-field-border rounded" />
            <span className="text-sm text-muted-foreground">Check this option</span>
          </div>
        );
      case 'date':
        return <div className="h-8 bg-form-field-bg border border-form-field-border rounded px-3 py-1.5 text-sm text-muted-foreground">mm/dd/yyyy</div>;
      default:
        return <div className="h-8 bg-form-field-bg border border-form-field-border rounded px-3 py-1.5 text-sm text-muted-foreground">Field preview</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Add Field Panel */}
      <Card sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
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
                <Plus sx={{ fontSize: 18, color: 'primary.contrastText' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Add Field</Typography>
                <Typography variant="body2" color="text.secondary">Choose a field type to add to your form</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(3, 1fr)', 
                md: 'repeat(4, 1fr)' 
              }, 
              gap: 2 
            }}>
              {Object.entries(fieldTypeConfig).map(([type, config]) => (
                <Button
                  key={type}
                  variant="outlined"
                  onClick={() => onAddField(type as FieldType)}
                  sx={{ 
                    height: 'auto', 
                    p: 2.5, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5,
                    borderRadius: 2,
                    borderWidth: 1,
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light',
                      '& .icon': { color: 'primary.main' }
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <Box className="icon" sx={{ 
                    color: 'text.secondary', 
                    transition: 'color 0.2s',
                    '& .MuiSvgIcon-root': { fontSize: 24 }
                  }}>
                    {config.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{config.label}</Typography>
                </Button>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card sx={{ 
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
                <GripVertical sx={{ fontSize: 18, color: 'primary.contrastText' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Form Fields</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentForm?.fields ? `${currentForm.fields.length} field${currentForm.fields.length !== 1 ? 's' : ''}` : 'No fields added'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {!currentForm?.fields || currentForm.fields.length === 0 ? (
              <Box sx={{ 
                p: 6, 
                textAlign: 'center', 
                border: '1px dashed', 
                borderColor: 'divider', 
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}>
                <Plus sx={{ fontSize: 48, mx: 'auto', mb: 3, opacity: 0.5 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>No fields added yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Start building your form by adding fields above
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentForm.fields
                  .sort((a: FormField, b: FormField) => a.order - b.order)
                  .map((field: FormField) => (
                  <Box
                    key={field.id}
                    onClick={() => onSelectField(field.id)}
                    sx={{
                      p: 2.5,
                      border: 1,
                      borderColor: selectedFieldId === field.id ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      bgcolor: selectedFieldId === field.id ? 'primary.light' : 'background.paper',
                      '&:hover': { 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                        borderColor: 'primary.main' 
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <GripVertical sx={{ 
                          fontSize: 16, 
                          color: selectedFieldId === field.id ? 'primary.main' : 'text.secondary', 
                          cursor: 'move' 
                        }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{field.label}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={field.type}
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: '0.75rem', height: 20, textTransform: 'capitalize' }}
                            />
                            {field.required && (
                              <Chip 
                                label="Required"
                                color="error"
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.75rem', height: 20 }}
                              />
                            )}
                            {field.isDerived && (
                              <Chip 
                                label="Derived"
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ fontSize: '0.75rem', height: 20 }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="text"
                        size="small"
                        onClick={(e: React.MouseEvent) => handleDeleteField(field.id, e)}
                        sx={{ 
                          minWidth: 32, 
                          width: 32, 
                          height: 32, 
                          p: 0,
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.light', color: 'error.main' }
                        }}
                      >
                        <Trash2 sx={{ fontSize: 12 }} />
                      </Button>
                    </Box>

                    {/* Field Preview */}
                    <Box sx={{ ml: 3.5 }}>
                      {getFieldPreview(field)}
                    </Box>

                    {/* Validation Rules Preview */}
                    {field.validationRules.length > 0 && (
                      <Box sx={{ ml: 3.5, mt: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {field.validationRules.map((rule: { type: string; value?: string | number }, ruleIndex: number) => (
                            <Chip 
                              key={ruleIndex} 
                              label={`${rule.type}${rule.value ? `: ${rule.value}` : ''}`}
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: '0.75rem', height: 20 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormBuilderPanel;