import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button, Chip, Typography, Box, Container } from '@mui/material';
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
  
  // Sort forms by updated date (most recent first)
  const sortedForms = [...savedForms].sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt).getTime() - 
           new Date(a.updatedAt || a.createdAt).getTime();
  });

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' 
              }}>
                <DescriptionIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>My Forms</Typography>
                <Typography variant="body1" color="text.secondary">Manage your saved forms</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card sx={{ 
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s'
        }}>
          <CardContent sx={{ py: 8, px: 4 }}>
            <Box sx={{ 
              width: 112, 
              height: 112, 
              bgcolor: 'primary.light', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mx: 'auto', 
              mb: 4,
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)'
            }}>
              <DescriptionIcon sx={{ fontSize: 56, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>No forms yet</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
              Get started by creating your first dynamic form with custom fields and validations. You can preview, edit, and share your forms anytime.
            </Typography>
            <Button 
              component={Link}
              to="/create"
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 28px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' 
              }}>
                <DescriptionIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>My Forms</Typography>
                <Typography variant="body1" color="text.secondary">
                  {savedForms.length} {savedForms.length === 1 ? 'form' : 'forms'} saved
                </Typography>
              </Box>
            </Box>
            <Button 
              component={Link}
              to="/create"
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s'
              }}
            >
              Create New Form
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3,
        animation: 'fadeIn 0.6s ease-in-out'
      }}>
        {sortedForms.map((form: FormSchema) => (
          <Card 
            key={form.id} 
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'all 0.3s',
              overflow: 'hidden',
              '&:hover': {
                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
            <CardHeader sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {form.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    />
                    {form.fields.some(f => f.isDerived) && (
                      <Chip 
                        label="Derived" 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderRadius: 2 }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </CardHeader>
            
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    bgcolor: 'success.light', 
                    borderRadius: '50%' 
                  }} />
                  <Typography variant="body2" color="text.secondary">
                    Created: {format(new Date(form.createdAt), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                {form.updatedAt !== form.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      bgcolor: 'info.light', 
                      borderRadius: '50%' 
                    }} />
                    <Typography variant="body2" color="text.secondary">
                      Updated: {format(new Date(form.updatedAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Field Types Preview */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                  Field Types:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {Array.from(new Set(form.fields.map(f => f.type))).slice(0, 4).map((type, index) => (
                    <Chip 
                      key={`${type}-${index}`} 
                      label={type} 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 24,
                        textTransform: 'capitalize',
                        borderRadius: 2,
                        borderColor: 'divider'
                      }}
                    />
                  ))}
                  {Array.from(new Set(form.fields.map(f => f.type))).length > 4 && (
                    <Chip 
                      label={`+${Array.from(new Set(form.fields.map(f => f.type))).length - 4} more`}
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 24,
                        borderRadius: 2,
                        borderColor: 'divider'
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                pt: 2, 
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handlePreviewForm(form.id)}
                  startIcon={<VisibilityIcon />}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)'
                    }
                  }}
                >
                  Preview
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEditForm(form.id)}
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light'
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleDeleteForm(form.id, form.name)}
                  color="error"
                  sx={{
                    borderRadius: 2,
                    minWidth: 'auto',
                    px: 1.5,
                    '&:hover': {
                      bgcolor: 'error.light'
                    }
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default MyForms;