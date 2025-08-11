import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { 
  Build as BuildIcon, 
  Visibility as VisibilityIcon, 
  List as ListIcon,
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
      icon: <ListIcon className="w-4 h-4" />,
    },
    {
      path: '/create',
      label: 'Create Form',
      icon: <BuildIcon className="w-4 h-4" />,
    },
    {
      path: '/preview',
      label: 'Preview',
      icon: <VisibilityIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} className="border-b bg-white/90 dark:bg-gray-800/90 backdrop-blur sticky top-0 z-50 shadow-sm">
        <Toolbar className="container mx-auto px-4 py-2">
          <Box className="flex items-center space-x-4">
            <Link to="/myforms" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <DescriptionIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">Form Builder</Typography>
                <Typography variant="caption" className="text-gray-600 dark:text-gray-300">Create dynamic forms with ease</Typography>
              </div>
            </Link>
          </Box>
          
          {/* Navigation */}
          <Box component="nav" className="hidden md:flex items-center space-x-2 ml-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="no-underline">
                <Button
                  variant={isActive(item.path) ? "contained" : "text"}
                  className={`flex items-center space-x-2 ${isActive(item.path) ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"}`}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
          
          {/* Mobile Navigation - Simplified for now */}
          <Box className="md:hidden ml-auto">
            <select 
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" className="py-8">
        <Box className="animate-fade-in">
          {children}
        </Box>
      </Container>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 Form Builder. Built with React & TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;