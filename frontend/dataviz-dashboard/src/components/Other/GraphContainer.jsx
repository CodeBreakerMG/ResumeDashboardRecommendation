import React, { useState } from 'react';
import { Paper, Box, IconButton } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';


const GraphContainer = ({ children, height_graph = 440  }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      child.type?.name === 'SkillFrequencyChart'
    ) {
      return React.cloneElement(child, { isExpanded });
    }
    return child;
  });

  return (
    <>
      {isExpanded && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1300,
            backgroundColor: 'white',
            overflowY: 'auto',
            padding: 4,
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 60 }}>
            <IconButton onClick={() => setIsExpanded(false)} sx={{ color: 'black' }}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box sx={{ width: '100%', height: '100%' }}>
            {enhancedChildren}
          </Box>
        </Box>
      )}

      {!isExpanded && (
        <Paper
          elevation={4}
          sx={{
            position: 'relative',
            height: height_graph,
            p: 4,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton onClick={() => setIsExpanded(true)}>
              <OpenInFullIcon />
            </IconButton>
          </Box>
          <Box sx={{ width: '100%', height: '100%' }}>
            {enhancedChildren}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default GraphContainer