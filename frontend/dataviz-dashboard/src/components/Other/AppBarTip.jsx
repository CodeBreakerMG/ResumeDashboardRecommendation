import * as React from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Stack
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';

const AppBarTip = ({
  filename = "Unknown.nothing",
  file = null,
  showSummary,
  onToggleSummary,
  userName = "Joe Examplea"  // You can pass this from MainPage
}) => {
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
      <AppBar position="static" sx={{ backgroundColor: '#005dab' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* LEFT: Title */}
          <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" fontWeight="bold" color="inherit">
            Job Recommendations
          </Typography>
          <IconButton color="inherit" onClick={onToggleSummary}>
              {showSummary ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            </Stack>
          {/* CENTER: User name */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon fontSize="small" />
            <Typography variant="subtitle1">{userName}</Typography>
          </Stack>

          {/* RIGHT: Filename, download & toggle */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <DescriptionIcon fontSize="small" />
            <Typography variant="body2">{filename}</Typography>

            <IconButton color="inherit" onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>


          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppBarTip;
