import React, { useRef } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      navigate('/main', { state: { file } }); // ← Pass the whole File object
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgb(0,93,189), rgb(255,133,0))',
      }}
    >
      {/* Pattern Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ffffff44' /%3E%3C/svg%3E")`,
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Smart Resume Parsing
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: 600, mb: 4 }}>
          Upload your resume and let our AI find the best job matches for you — fast, accurate, and personalized.
        </Typography>

        <Button variant="contained" onClick={handleUploadClick}>
          Upload Resume
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.txt"
        />
      </Container>
    </Box>
  );
};

export default LandingPage;
