import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Redirect to MyForms as the default page
  return <Navigate to="/myforms" replace />;
};

export default Index;
