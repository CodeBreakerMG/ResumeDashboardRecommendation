import React from 'react'; //This is the React Base module
import { Box, Grid, Typography, Paper } from '@mui/material'; //Base Material UI Components https://mui.com/material-ui/react-box/
import DataTable from '../components/DataTable/DataTable';

const SampleOldPage = () => {
    return (
        <Box p={4} sx={{ backgroundColor: '#f6f7fb', minHeight: '100vh' }}>
          <Typography variant="h3" fontWeight={600} color="#052962" gutterBottom>
            Resume Parser
          </Typography>
    
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{ padding: 3, backgroundColor: '#ffffff', borderLeft: '8px solid #005DAB' }}
              >
                <Typography variant="h6" color="#052962" gutterBottom>
                  Tabla de Datos
                </Typography>
                <DataTable />
              </Paper>
            </Grid>
    
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{ padding: 3, backgroundColor: '#ffffff', borderLeft: '8px solid #f4868d' }}
              >
                <Typography variant="h6" color="#052962" gutterBottom>
                  Gráficos (Próximamente)
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="#777">Aquí se mostrarán tus gráficos</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      );
    };

export default SampleOldPage;


/*

Material UI Components,  can be customized via props like sx, className, etc.
    Box                                 :   Acts like a <div>, but with more styling. <Box sx={{ padding: 2, backgroundColor: 'lightgray' }}>Content</Box>
    Grid                                :   A flexbox-based layout. Positions Items in a grid layout, which is rows and columns. <Grid container spacing={2}> <Grid item xs={6}>Left</Grid> <Grid item xs={6}>Right</Grid> </Grid> 
    Typography                          :   Used for text elements (like headings, paragraphs). <Typography variant="h5">Hello</Typography>
    Paper                               :   Container with a paper look like a card. Adds elevation (shadow), padding, etc.  <Paper elevation={3}>Card content</Paper>

 
*/