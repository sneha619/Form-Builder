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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl border border-border/50">
        <div className="relative p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Hammer className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Form Builder
              </h1>
              <p className="text-muted-foreground text-lg">Create dynamic forms with custom fields and validations</p>
            </div>
          </div>

          {/* Form Name Section */}
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 p-6">
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
                 />
              </div>
              
              <div className="flex items-center justify-between lg:justify-end gap-3">
                <div className="flex items-center gap-2">
                  <Chip 
                     label={`${currentForm.fields.length} field${currentForm.fields.length !== 1 ? 's' : ''}`}
                     color={currentForm.fields.length > 0 ? "primary" : "default"}
                     size="small"
                   />
                </div>
                
                <div className="flex gap-2">
                  {canPreview && (
                    <Button
                       variant="outlined"
                       startIcon={<Eye />}
                       onClick={handlePreview}
                       disabled={!canPreview}
                       className="border-2 hover:bg-primary/5 transition-all duration-300 font-medium"
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
                     className="shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                   >
                     Save Form
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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