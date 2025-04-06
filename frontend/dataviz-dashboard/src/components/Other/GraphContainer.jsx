import React from 'react';
import { Paper, Box } from '@mui/material';

const GraphContainer = ({ children }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        maxWidth: "100%", 
        borderRadius: 4, 
        height: 400, 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default GraphContainer;


/*
TO USE THIS GRAPH CONTAINER (Anything inside <GraphContainer> would be Children)

<GraphContainer>
  <Typography variant="h5">Hello World</Typography>
  <YourCoolGraph />
</GraphContainer>

*/ 