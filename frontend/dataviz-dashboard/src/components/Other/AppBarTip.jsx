import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';

const AppBarTip = ({ filename = "Unknown.nothing", file = null } = {}) => {

  const handleDownload = () => {
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl); // Free up memory
  };
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontWeight: 'bold'}}
          >
            Resume Parser
          </Typography>
          <Typography variant="h6" component="div">
            {filename}
          </Typography>
          {file && (
            <IconButton 
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr:2, paddingX: 3}}
              onClick={handleDownload}>
              <DownloadIcon />
            </IconButton >
          )}

        </Toolbar>
      </AppBar>
    </Box>
  );
}


export default AppBarTip;


 // 👈 This makes it bold