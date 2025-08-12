import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { 
  Build as BuildIcon, 
  Visibility as VisibilityIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };



  const navItems = [
    {
      path: '/myforms',
      label: 'My Forms',
      icon: <VisibilityIcon className="w-4 h-4" />,
    },
    {
      path: '/create',
      label: 'Create Form',
      icon: <BuildIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 2, px: 4 }}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 no-underline">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <DescriptionIcon sx={{ color: 'white', fontSize: 28 }} />
            </div>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              Form Builder
            </Typography>
          </Link>

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                variant={isActive(item.path) ? 'contained' : 'text'}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '0.95rem',
                  ...(isActive(item.path) ? {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                    },
                    transition: 'all 0.2s'
                  } : {
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s'
                  })
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" maxWidth={false} sx={{ py: 4, px: 3, maxWidth: '1400px', mx: 'auto' }}>
        <Box sx={{ 
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {children}
        </Box>
      </Container>


    </div>
  );
};

export default Layout;