import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AppBarTip = ({ filename = "Unknown.nothing", file = null, showSummary, onToggleSummary }) => {
  const handleDownload = () => {
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
          >
            Resume Parser
          </Typography>

          <Typography variant="h6" component="div">
            {filename}
          </Typography>

          <IconButton
            size="large"
            color="inherit"
            sx={{ mx: 2 }}
            onClick={onToggleSummary}
          >
            {showSummary ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>

          {file && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="download"
              sx={{ paddingX: 2 }}
              onClick={handleDownload}
            >
              <DownloadIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppBarTip;
