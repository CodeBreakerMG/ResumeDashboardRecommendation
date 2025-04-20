import React, { useState } from 'react';
import { Paper, Box, IconButton } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';

const GraphContainer = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          {/* Close (X) Button */}
          <Box sx={{ position: 'absolute', top: 16, right: 60 }}>
            <IconButton
              onClick={() => setIsExpanded(false)}
              sx={{ color: 'black' }}
              aria-label="Close fullscreen"
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          <Box sx={{ width: '100%', height: '100%' }}>
            {children}
          </Box>
        </Box>
      )}

      {!isExpanded && (
        <Paper
          elevation={4}
          sx={{
            position: 'relative',
            height: 400,
            p: 4,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Expand Button */}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton
              onClick={() => setIsExpanded(true)}
              aria-label="Expand fullscreen"
            >
              <OpenInFullIcon />
            </IconButton>
          </Box>

          <Box sx={{ width: '100%', height: '100%' }}>
            {children}
          </Box>
        </Paper>
      )}
    </>
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