// theme.js
import './assets/fonts/fonts.css';
// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#005dab',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff8500',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: 'rgba(51, 51, 51, 0.8)',
    },
    background: {
      default: '#ffffff',
    },
  },

  typography: {
    fontFamily: '"Flexo", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          height: '100vh',
          background: 'linear-gradient(135deg, #005dab 0%, #ff8500 100%)',
          overflow: 'hidden',
          fontFamily: '"Flexo", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
