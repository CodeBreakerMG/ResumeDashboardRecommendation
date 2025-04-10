// # (Optional) Material UI custom theme setup
/*
    This is a multi-line comment.
    It can be used to explain a block of code
    or to temporarily disable it.
*/

 
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Flexo, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2', // Customize as needed
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default theme;
