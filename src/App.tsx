import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormStateProvider } from './hooks/useFormState';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from "./components/Layout";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // blue-500
    },
    secondary: {
      main: '#6366f1', // indigo-500
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
        },
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <FormStateProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<MyForms />} />
                <Route path="/create" element={<CreateForm />} />
                <Route path="/preview" element={<PreviewForm />} />
                <Route path="/myforms" element={<MyForms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </FormStateProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;