import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import MainPage from './pages/MainPage';
import SampleMainPage from './pages/SampleMainPage';
 

function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/sample" element={<SampleMainPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
    
      
 
  );
}

export default App;


/*
import React from 'react'; //This is the React Base module
import { Box, Grid, Typography, Paper } from '@mui/material'; //Base Material UI Components https://mui.com/material-ui/react-box/
import DataTable from '../components/DataTable/DataTable';

const MainPage = () => {
    return(
        <Box p={4}>
            <Typography variant='h4' gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Data Table</Typography>
                        <DataTable />
                    </Paper>
                </Grid>
            
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                        <Typography variant="h6">Charts</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainPage;

*/