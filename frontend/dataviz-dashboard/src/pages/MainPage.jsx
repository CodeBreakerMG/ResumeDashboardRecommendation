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
import MatchScoreChart from '../components/Charts/MatchScoreChart';
import SkillWordCloud from '../components/Charts/SkillWordCloud';
import ResumeSummary from '../components/Textual/ResumeSummary';



import jobsData from "../assets/jobsData.json"; // adjust the path accordingly

//const FAST_API_URL = "https://fine-nights-rush.loca.lt/resume/match" //OLD ONE

//const FAST_API_URL =  "https://cloud.cesarsp.com:26000/resume/match"  //NEW ONE
const FAST_API_URL =  "https://cac2-172-103-86-169.ngrok-free.app/resume/match"

//https://cloud.cesarsp.com:26000/docs


const MainPage = () => {


  const location = useLocation();
  const uploadedFile = location.state?.file;
  const fileName = uploadedFile.name;

  const [loading, setLoading] = useState(false);
  const [jobIndex, setJobIndex] = useState(0);
  const [jobs, setJobs] = useState([]);         //matches
  const [resume_skills, setResume_skills] = useState([]);
  const [word_cloud_skills_freq, setWord_cloud_skills_freq] = useState([]);
  const [salaryTrends, setSalaryTrends] = useState({});    


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
        setResume_skills(response.data.resume_skills); // Or response.data.jobs
        setWord_cloud_skills_freq(response.data.word_cloud_skills_freq); // Or response.data.jobs
        setSalaryTrends(response.data.salaryTrend); // Or response.data.jobs
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("API call failed or timed out. Using local fallback.", error);
        setJobs(jobsData.matches); // Load local jobs
        setResume_skills(jobsData.resume_skills); // Load local jobs
        setWord_cloud_skills_freq(jobsData.word_cloud_skills_freq); // Load local jobs
        setSalaryTrends(jobsData.salaryTrend); // Load local jobs

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

  const parseYears = (exp) => {
    if (!exp) return [0, 0];
    const nums = exp.match(/\d+/g)?.map(Number);
    return nums?.length === 2 ? [nums[0], nums[1]] : [nums?.[0] ?? 0, nums?.[0] ?? 0];
  };
  
  
/*
  <ResumeSummary
  resumeSkills={resume_skills}
  summary={{
    name: "John Doe", // Replace with parsed name
    title: "Computer Science Graduate",
    numJobs: 3,
    yearsOfExperience: 2.5
  }}
/>  
*/

 return (
  <>
    {loading ? (
      <Box
        component="main"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(0, 93, 171, 0.08) 0%,
              rgba(255, 133, 0, 0.08) 100%
            )
          `,
          color: '#333',
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
   
        <Grid size={12} />
        <Grid size={4} container>
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
      <Grid size={8} container>
      <Grid size={4} paddingX={1}>
<<<<<<< Updated upstream
=======
          <GraphContainer>
            <Typography variant="h5" gutterBottom>Match Score</Typography>
              <MatchScoreChart
                overall={100*jobs[jobIndex].matchScore}
                experience={100}
                skill={86}
                industry={33}
              />
          </GraphContainer>
        </Grid>
        <Grid size={4} paddingX={1}>
>>>>>>> Stashed changes
          <GraphContainer>
            <Typography variant="h5" gutterBottom>Match Score</Typography>
              <MatchScoreChart
                overall={100*jobs[jobIndex].matchScore}
                experience={100}
                skill={86}
                industry={33}
              />
          </GraphContainer>
        </Grid>
        <Grid size={4} paddingX={1}>
<<<<<<< Updated upstream
          <GraphContainer>
            <Typography variant="h5" gutterBottom color="secondary">Experience & Salary Comparison</Typography>
            {(() => {
            const title = jobs[jobIndex]?.jobTitle;
            const progression = salaryTrends[title]?.progression || {};
            return (
              <JobComparisonChart
                progression={progression}
              />
            );
          })()}
          </GraphContainer>
        </Grid>
<<<<<<< Updated upstream
        <Grid size={6} paddingX={1}>
          
        <GraphContainer>
           <Typography variant="h5" color="secondary">Location</Typography>
           {(() => {
             const title        = jobs[jobIndex]?.jobTitle;
             const stateData    = salaryTrends[title]?.location || {};
             const fullLocation = jobs[jobIndex].location;
             console.log("🏷️ [MainPage] passing to LocationMap:", {
               title, fullLocation, stateData
             });
             return (
               <LocationMap
                 location={fullLocation}
                 stateSalaryData={stateData}
               />
             );
           })()}
         </GraphContainer>
=======
        <Grid size={4} paddingX={1}>
=======
>>>>>>> Stashed changes
          <GraphContainer>
            <Typography variant="h5">Location</Typography>
            <LocationMap location={jobs[jobIndex].location}/>
          </GraphContainer>
>>>>>>> Stashed changes
        </Grid>
        <Grid size={8} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5" gutterBottom color="secondary">Skill Frequency</Typography>
            <SkillFrequencyChart job={jobs[jobIndex]} jobs={jobs} />
          </GraphContainer>
        </Grid>
        <Grid size={4} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5" gutterBottom color="secondary">Benefit Coverage</Typography>
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