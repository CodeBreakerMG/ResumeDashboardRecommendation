import React, { useEffect, useState } from 'react'; //This is the React Base module
import { Stack, Box, Grid, Typography, Button, Paper  } from '@mui/material'; //Base Material UI Components https://mui.com/material-ui/react-box/
import { useLocation } from 'react-router-dom';
import axios from 'axios';


import JobDetailView from '../components/Textual/JobDetailView';
import AppBarTip from '../components/Other/AppBarTip';
import GraphContainer from '../components/Other/GraphContainer';
import LocationMap from '../components/Charts/LocationMap';
import SkillFrequencyChart from '../components/Charts/SkillFrequencyChart';
import JobBenefitsRadarChart from '../components/Charts/JobBenefitsRadarChart';
import JobComparisonChart from '../components/Charts/JobComparisonChart';

import jobsData from "../assets/jobsData.json"; // adjust the path accordingly

//const FAST_API_URL = "https://fine-nights-rush.loca.lt/resume/match" //OLD ONE

const FAST_API_URL =  "https://cloud.cesarsp.com:26000/resume/match"  //NEW ONE


//https://cloud.cesarsp.com:26000/docs


const MainPage = () => {


  const location = useLocation();
  const uploadedFile = location.state?.file;
  const fileName = uploadedFile.name;

  const [loading, setLoading] = useState(false);
  const [jobIndex, setJobIndex] = useState(0);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const sendFileToAPI = async () => {
      if (!uploadedFile) return;
  
      setLoading(true);
  
      const formData = new FormData();
      formData.append("file", uploadedFile);
  
      const fetchWithTimeout = () =>
        Promise.race([
          axios.post(FAST_API_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 30000)
          ),
        ]);
  
      try {
        const response = await fetchWithTimeout();
        setJobs(response.data.matches); // Or response.data.jobs
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("API call failed or timed out. Using local fallback.", error);
        setJobs(jobsData); // Load local jobs
      } finally {
        setLoading(false);
      }
    };
  
    sendFileToAPI();
  }, [uploadedFile]);
  
    // 
    // setJobs(jobsData); [Deprecated] Old Data from frontend folders Simulate async loading
  //}, []);

  const handleNext = () => {
    setJobIndex((prev) => (prev + 1 < jobs.length ? prev + 1 : 0));
  };

  const handlePrevious = () => {
    setJobIndex((prev) => (prev - 1 >= 0 ? prev - 1 : jobs.length - 1));
  };

 return (
  <>
    {loading ? (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255,255,255,0.8)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Parsing Resume...</Typography>
        {/* Optional: <CircularProgress color="primary" sx={{ ml: 2 }} /> */}
      </Box>
    ) : jobs.length > 0 ? (
      <Grid container spacing={2}>
        <AppBarTip filename={fileName} file={uploadedFile} />
        <Grid size={12}>
        </Grid>
      <Grid size={5}>
        <Paper
            sx={{
              height: '97%',
              overflowY: 'auto',
              p: 2,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
            elevation={3}
          >
          <JobDetailView job={jobs[jobIndex]} />
          <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            <Button variant="outlined" onClick={handlePrevious}>Previous</Button>
            <Button variant="contained" onClick={handleNext}>Next</Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={7} container>
        <Grid size={6} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5" gutterBottom>Experience & Salary Comparison</Typography>
            <JobComparisonChart job={jobs[jobIndex]} jobs={jobs} />
          </GraphContainer>
        </Grid>
        <Grid size={6} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5">Location</Typography>
            <LocationMap location={jobs[jobIndex].location}/>
          </GraphContainer>
        </Grid>
        <Grid size={8} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5" gutterBottom>Skill Frequency</Typography>
            <SkillFrequencyChart job={jobs[jobIndex]} jobs={jobs} />
          </GraphContainer>
        </Grid>
        <Grid size={4} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5" gutterBottom>Benefit Coverage</Typography>
            <JobBenefitsRadarChart job={jobs[jobIndex]} jobs={jobs} />
          </GraphContainer>
        </Grid>

      </Grid>
    </Grid>
    ) : (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}>
        No job data found. Please upload a valid file.
      </Typography>
    )}
  </>
);
};

export default MainPage;


/*

Material UI Components,  can be customized via props like sx, className, etc.
    Box                                 :   Acts like a <div>, but with more styling. <Box sx={{ padding: 2, backgroundColor: 'lightgray' }}>Content</Box>
    Grid                                :   A flexbox-based layout. Positions Items in a grid layout, which is rows and columns. <Grid container spacing={2}> <Grid item xs={6}>Left</Grid> <Grid item xs={6}>Right</Grid> </Grid> 
    Typography                          :   Used for text elements (like headings, paragraphs). <Typography variant="h5">Hello</Typography>
    Paper                               :   Container with a paper look like a card. Adds elevation (shadow), padding, etc.  <Paper elevation={3}>Card content</Paper>

 
*/