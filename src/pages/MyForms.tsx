import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button, Chip, Typography } from '@mui/material';
import { useFormState } from '../hooks/useFormStateHook';
import { FormSchema } from '../types/form';
import { useSnackbar } from 'notistack';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const { savedForms, loadForm, deleteForm, refreshSavedForms } = useFormState();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Refresh forms from localStorage
    refreshSavedForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreviewForm = (formId: string) => {
    loadForm(formId);
    navigate('/preview');
  };

  const handleEditForm = (formId: string) => {
    loadForm(formId);
    navigate('/create');
  };

  const handleDeleteForm = (formId: string, formName: string) => {
    if (window.confirm(`Are you sure you want to delete "${formName}"? This action cannot be undone.`)) {
      deleteForm(formId);
      enqueueSnackbar(`"${formName}" has been deleted successfully.`, { variant: 'success' });
    }
  };

  if (savedForms.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Forms</h1>
            <p className="text-muted-foreground mt-2">Manage your saved forms</p>
          </div>
        </div>

        {/* Empty State */}
        <Card className="text-center py-12 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 rounded-xl overflow-hidden">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <DescriptionIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get started by creating your first dynamic form with custom fields and validations.
            </p>
            <Link to="/create">
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                className="shadow-md hover:shadow-lg transition-all"
              >
                Create Your First Form
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Forms</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {savedForms.length} form{savedForms.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Link to="/create">
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            className="shadow-md hover:shadow-lg transition-all"
          >
            Create New Form
          </Button>
        </Link>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {savedForms.map((form: FormSchema) => (
          <Card key={form.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Typography variant="h6" className="text-lg truncate">{form.name}</Typography>
                   <div className="flex items-center space-x-2 mt-2">
                     <Chip 
                       label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                       size="small"
                       variant="filled"
                     />
                     {form.fields.some(f => f.isDerived) && (
                       <Chip label="Derived" size="small" variant="outlined" />
                     )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Created: {format(new Date(form.createdAt), 'MMM dd, yyyy')}</p>
                {form.updatedAt !== form.createdAt && (
                  <p>Updated: {format(new Date(form.updatedAt), 'MMM dd, yyyy')}</p>
                )}
              </div>

              {/* Field Types Preview */}
              <div className="flex flex-wrap gap-1 mb-4">
                {Array.from(new Set(form.fields.map(f => f.type))).slice(0, 4).map((type, index) => (
                   <Chip 
                     key={`${type}-${index}`} 
                     label={type} 
                     size="small" 
                     variant="outlined" 
                     className="text-xs capitalize"
                   />
                 ))}
                 {Array.from(new Set(form.fields.map(f => f.type))).length > 4 && (
                   <Chip 
                     label={`+${Array.from(new Set(form.fields.map(f => f.type))).length - 4} more`}
                     size="small" 
                     variant="outlined" 
                     className="text-xs"
                   />
                 )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                   variant="contained"
                   size="small"

                   onClick={() => handlePreviewForm(form.id)}
                   startIcon={<VisibilityIcon />}
                   className="flex-1"
                 >
                   Preview
                 </Button>
                 <Button
                   variant="outlined"
                   size="small"
                   onClick={() => handleEditForm(form.id)}
                   startIcon={<EditIcon />}
                 >
                   Edit
                 </Button>
                 <Button
                   variant="outlined"
                   size="small"
                   onClick={() => handleDeleteForm(form.id, form.name)}
                   color="error"
                 >
                   <DeleteIcon />
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyForms;