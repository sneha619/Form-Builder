import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button, Chip, Typography, LinearProgress } from '@mui/material';
import { useFormState } from '../hooks/useFormStateHook';
import { useSnackbar } from 'notistack';
import { validateForm, calculateDerivedField } from '../utils/validation';
// import { FormData } from '../types/form';
import FormRenderer from '../components/FormRenderer';
import { 
  ArrowBack as BackIcon,
  Build as BuildIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { FormField } from '../types/form';

const PreviewForm: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentForm, 
    currentFormData, 
    validationErrors, 
    setPreviewMode, 
    updateFormData, 
    setValidationErrors 
  } = useFormState();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentForm) {
      navigate('/myforms');
      return;
    }
    setPreviewMode(true);
  }, [currentForm, navigate, setPreviewMode]);

  useEffect(() => {
    // Calculate derived fields whenever form data changes
    if (currentForm) {
      const derivedFields = currentForm.fields.filter((f) => f.isDerived === true);
      const updatedData = { ...currentFormData };
      let hasChanges = false;

      derivedFields.forEach((field: { id: string; isDerived?: boolean }) => {
        const calculatedValue = calculateDerivedField(field as FormField, currentFormData, currentForm.fields);
        if (updatedData[field.id] !== calculatedValue) {
          updatedData[field.id] = calculatedValue as string | number | boolean | string[] | null;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        Object.keys(updatedData).forEach(fieldId => {
          if (updatedData[fieldId] !== currentFormData[fieldId]) {
            updateFormData(fieldId, updatedData[fieldId]);
          }
        });
      }
    }
  }, [currentFormData, currentForm, updateFormData]);

  const handleFieldChange = (fieldId: string, value: string | number | boolean | Date | null) => {
    updateFormData(fieldId, value as string | number | boolean | string[] | null);
  };

  const handleSubmit = async () => {
    if (!currentForm) return;

    setIsSubmitting(true);
    
    try {
      // Validate all fields
      const errors = validateForm(currentForm.fields, currentFormData);
      setValidationErrors(errors);

      if (errors.length > 0) {
        enqueueSnackbar(`Please fix ${errors.length} error${errors.length !== 1 ? 's' : ''} before submitting.`, { variant: 'error' });
        return;
      }

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      enqueueSnackbar('Form submitted successfully! Your form data has been processed.', { variant: 'success' });

      // In a real app, you'd send data to a server here
      console.log('Form submitted with data:', currentFormData);

    } catch {
      enqueueSnackbar('There was an error submitting your form. Please try again.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No form to preview</h2>
            <p className="text-muted-foreground mb-4">Please create or select a form first.</p>
            <Button onClick={() => navigate('/myforms')}>
              Back to My Forms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedFields = currentForm.fields.filter((f: { id: string }) => {
    const value = currentFormData[f.id];
    return value !== undefined && value !== null && value !== '';
  }).length;

  const progressPercentage = currentForm.fields.length > 0 
    ? Math.round((completedFields / currentForm.fields.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            startIcon={<BackIcon />}
          >
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <Chip 
              label={`Progress: ${progressPercentage}%`}
              variant="outlined"
              size="small"
            />
            {validationErrors.length > 0 && (
              <Chip 
                icon={<ErrorIcon />}
                label={`${validationErrors.length} error${validationErrors.length !== 1 ? 's' : ''}`}
                color="error"
                variant="outlined"
                size="small"
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-light rounded-lg">
            <BuildIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{currentForm.name}</h1>
            <p className="text-muted-foreground">Form Preview - Test your form as an end user would see it</p>
          </div>
        </div>
      </div>

      {/* Form Preview */}
      <Card className="mb-6">
        <CardHeader>
           <div className="flex items-center justify-between">
             <Typography variant="h6">{currentForm.name}</Typography>
             <Chip 
               label={`${currentForm.fields.length} field${currentForm.fields.length !== 1 ? 's' : ''}`}
               size="small"
               variant="filled"
             />
           </div>
         </CardHeader>
        <CardContent>
          <FormRenderer
            form={currentForm}
            formData={currentFormData}
            validationErrors={validationErrors}
            onFieldChange={(fieldId: string, value: string | number | boolean | string[] | null) => {
              handleFieldChange(fieldId, value as string | number | boolean | Date | null);
            }}
            isPreview={true}
          />
          
          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {completedFields} of {currentForm.fields.length} fields completed
              </div>
              
              <Button
                 variant="contained"
                 onClick={handleSubmit}
                 disabled={isSubmitting}
                 startIcon={isSubmitting ? null : <CheckIcon />}
               >
                 {isSubmitting ? 'Submitting...' : 'Submit Form'}
               </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Form completion</span>
                <span>{progressPercentage}%</span>
              </div>
              <LinearProgress 
                 variant="determinate" 
                 value={progressPercentage} 
                 className="w-full h-2 rounded-full"
               />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info (for development) */}
      {import.meta.env.DEV && (
        <Card>
          <CardHeader>
             <Typography variant="subtitle2">Debug Information</Typography>
           </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Form Data:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                  {JSON.stringify(currentFormData, null, 2)}
                </pre>
              </div>
              {validationErrors.length > 0 && (
                <div>
                  <strong>Validation Errors:</strong>
                  <pre className="mt-1 p-2 bg-destructive/10 rounded text-xs overflow-auto">
                    {JSON.stringify(validationErrors, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreviewForm;