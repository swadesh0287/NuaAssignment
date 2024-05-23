import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
      primary: {
          main: '#1976d2',
      },
      secondary: {
          main: '#dc004e',
      },
  },
  typography: {
      h4: {
          fontWeight: 600,
      },
  },
  components: {
      MuiButton: {
          styleOverrides: {
              root: {
                  borderRadius: '8px',
              },
          },
      },
      MuiPaper: {
          styleOverrides: {
              root: {
                  padding: '2rem',
              },
          },
      },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
  </React.StrictMode>
);



