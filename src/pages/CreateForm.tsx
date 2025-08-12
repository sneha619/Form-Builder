import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button, TextField, Chip } from '@mui/material';
import { useFormState } from '../hooks/useFormStateHook';
import { useSnackbar } from 'notistack';
// import { useToast } from '../hooks/use-toast';
import type { FieldType } from '../types/form';
import FormBuilderPanel from '../components/FormBuilderPanel';
import FieldConfigPanel from '../components/FieldConfigPanel';
import { 
  Save,
  Visibility as Eye,
  Build as Hammer
} from '@mui/icons-material';

const CreateForm: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentForm, 
    createNewForm, 
    updateFormName, 
    addField, 
    saveCurrentForm,
    setPreviewMode 
  } = useFormState();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isFormNameValid, setIsFormNameValid] = useState(false);

  useEffect(() => {
    // Create new form if none exists
    if (!currentForm) {
      createNewForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentForm]);

  useEffect(() => {
    setIsFormNameValid(!!currentForm?.name?.trim());
  }, [currentForm?.name]);

  const handleFormNameChange = (name: string) => {
    updateFormName(name);
  };

  const handleAddField = (type: FieldType) => {
    const newField = addField(type);
    setSelectedFieldId(newField.id);
  };

  const handleSaveForm = async () => {
    if (!currentForm?.name?.trim()) {
      enqueueSnackbar('Please enter a name for your form before saving.', { variant: 'error' });
      return;
    }

    if (currentForm.fields.length === 0) {
      enqueueSnackbar('Please add at least one field to your form before saving.', { variant: 'error' });
      return;
    }

    try {
      const success = await saveCurrentForm();
      
      if (success) {
        enqueueSnackbar(`"${currentForm.name}" has been saved to your forms.`, { variant: 'success' });
      } else {
        throw new Error('Save failed');
      }
    } catch {
      enqueueSnackbar('There was an error saving your form. Please try again.', { variant: 'error' });
    }
  };

  const handlePreview = () => {
    if (!currentForm?.name?.trim()) {
      enqueueSnackbar('Please enter a name for your form before previewing.', { variant: 'error' });
      return;
    }

    setPreviewMode(true);
    navigate('/preview');
  };

  if (!currentForm) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading form builder...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canPreview = isFormNameValid && currentForm.fields.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Enhanced Header */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <CardContent sx={{ p: 4 }}>
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Hammer className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Form Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Create dynamic forms with custom fields and validations</p>
            </div>
          </div>

          {/* Form Name Section */}
          <Card sx={{ 
            mt: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <CardContent sx={{ p: 3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                <div className="lg:col-span-2">
                  <TextField
                     id="formName"
                     label="Form Name *"
                     value={currentForm.name || ''}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormNameChange(e.target.value)}
                     placeholder="Enter a descriptive name for your form..."
                     fullWidth
                     variant="outlined"
                     size="medium"
                     error={!isFormNameValid && currentForm.name !== undefined}
                     helperText={!isFormNameValid && currentForm.name !== undefined ? 'Form name is required' : ''}
                     sx={{
                       '& .MuiOutlinedInput-root': {
                         borderRadius: 2,
                         '&:hover fieldset': {
                           borderColor: 'primary.main',
                         },
                       },
                     }}
                   />
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-3">
                  <div className="flex items-center gap-2">
                    <Chip 
                       label={`${currentForm.fields.length} field${currentForm.fields.length !== 1 ? 's' : ''}`}
                       color={currentForm.fields.length > 0 ? "primary" : "default"}
                       size="small"
                       sx={{ fontWeight: 500 }}
                     />
                  </div>
                  
                  <div className="flex gap-2">
                    {canPreview && (
                      <Button
                         variant="outlined"
                         startIcon={<Eye />}
                         onClick={handlePreview}
                         disabled={!canPreview}
                         sx={{
                           borderRadius: 2,
                           fontWeight: 500,
                           textTransform: 'none',
                           px: 3,
                           '&:hover': {
                             transform: 'translateY(-1px)',
                             boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                           },
                           transition: 'all 0.2s'
                         }}
                       >
                         Preview
                       </Button>
                    )}
                    
                    <Button
                       variant="contained"
                       color="primary"
                       onClick={handleSaveForm}
                       disabled={!isFormNameValid}
                       startIcon={<Save />}
                       sx={{
                         borderRadius: 2,
                         fontWeight: 500,
                         textTransform: 'none',
                         px: 3,
                         boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                         '&:hover': {
                           transform: 'translateY(-1px)',
                           boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                         },
                         transition: 'all 0.2s'
                       }}
                     >
                       Save Form
                     </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Builder Panel */}
        <div className="lg:col-span-2">
          <FormBuilderPanel
            onAddField={handleAddField}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />
        </div>

        {/* Field Configuration Panel */}
        <div className="lg:col-span-1">
          <FieldConfigPanel
            selectedFieldId={selectedFieldId}
            onFieldUpdated={() => setSelectedFieldId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateForm;