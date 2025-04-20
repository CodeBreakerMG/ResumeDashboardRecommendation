import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ResumeIcon from '@mui/icons-material/Description';
import SpeedIcon from '@mui/icons-material/Speed';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import sample1Pdf from '../assets/sample_resumes/Sample1.pdf';
import sample2Pdf from '../assets/sample_resumes/Sample2.pdf';
import sample3Pdf from '../assets/sample_resumes/Sample3.pdf';


export default function LandingPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) navigate('/main', { state: { file } });
  };
  const handleUploadClick = () => fileInputRef.current.click();

  const sampleMap = {
    sample1: sample1Pdf,
    sample2: sample2Pdf,
    sample3: sample3Pdf
  };
  
const handleSampleClick = async (key) => {
  const url = sampleMap[key];               
  const res = await fetch(url);
  const blob = await res.blob();
  const file = new File(
    [blob],
    `${key}.pdf`,                           
    { type: blob.type }
  );
  navigate('/main', { state: { file } });
};


  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #005dab 0%, #ff8500 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Left column: Hero & upload */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: { xs: 4, md: 8 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ResumeIcon sx={{ fontSize: 48, mr: 1 }} aria-hidden="true" />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            Smart Resume Parsing
          </Typography>
        </Box>

        <Typography variant="h6" component="p" sx={{ maxWidth: 500, mb: 4, opacity: 0.9 }}>
          Upload your resume and let our AI match you with the best opportunities—accurate, personalized, and lightning‑fast.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            size="large"
            variant="contained"
            onClick={handleUploadClick}
            sx={{
              backgroundColor: '#fff',
              color: '#005dab',
              fontWeight: 600,
              px: 5,
              py: 1.5,
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
            aria-label="Upload your resume"
          >
            Upload Resume
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSampleClick('sample1')}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontWeight: 600,
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
              aria-label="Try sample resume 1"
            >
              Sample 1
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSampleClick('sample2')}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontWeight: 600,
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
              aria-label="Try sample resume 2"
            >
              Sample 2
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleSampleClick('sample3')}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontWeight: 600,
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
              aria-label="Try sample resume 3"
            >
              Sample 3
            </Button>
          </Box>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </Box>

      {/* Right column: Feature cards */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, md: 6 },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
            maxWidth: 400,
            bgcolor: 'rgba(255,255,255,0.95)',
            color: '#333',
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <SpeedIcon color="primary" sx={{ fontSize: 40 }} aria-hidden="true" />
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                Fast Processing
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                Get results in seconds, not hours—our optimized AI parses your resume instantly.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <ThumbUpIcon color="primary" sx={{ fontSize: 40 }} aria-hidden="true" />
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                Accurate Matches
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                Advanced algorithms surface the most relevant jobs tailored to your skills.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <ResumeIcon color="primary" sx={{ fontSize: 40 }} aria-hidden="true" />
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                Easy to Use
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                Simply upload a file and let our intuitive UI guide you through next steps.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <SpeedIcon color="primary" sx={{ fontSize: 40 }} aria-hidden="true" />
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                Personalized
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                Tailored recommendations based on your unique work history and skills.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
