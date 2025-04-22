import React, { useEffect, useState } from 'react'; // This is the React Base module
import { Stack, Box, Grid, Typography, Button, Paper } from '@mui/material'; // Base Material UI Components https://mui.com/material-ui/react-box/
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

import jobsData from "../assets/jobsData_v2.json"; // adjust the path accordingly

 
const FAST_API_URL =  "https://cloud.cesarsp.com:26000/resume/match"  // NEW ONE
const TIMEOUT_MILISECONDS = 60000 //60000
// https://cloud.cesarsp.com:26000/docs

const MainPage = () => {
  const location = useLocation();
  const uploadedFile = location.state?.file;
  const fileName = uploadedFile.name;

  const [loading, setLoading] = useState(false);
  const [jobIndex, setJobIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [jobs, setJobs] = useState([]);         // matches
  const [resume_skills, setResume_skills] = useState([]);
  const [word_cloud_skills_freq, setWord_cloud_skills_freq] = useState([]);
  const [salaryTrends, setSalaryTrends] = useState({});
  const [resumeProfile, setResumeProfile] = useState([]);         // matches 

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
            setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MILISECONDS)
          ),
        ]);

      let incomingJobs = [];

      try {
        const response = await fetchWithTimeout();
        incomingJobs = response.data.matches;
        //setJobs(response.data.matches); // Or response.data.jobs
        setResume_skills(response.data.resume_skills);
        setWord_cloud_skills_freq(response.data.word_cloud_skills_freq);
        setSalaryTrends(response.data.salaryTrend);
        setResumeProfile(response.data.resumeProfile);
        console.log("API Response:", response.data);
      }
      catch (error) {
        console.error("API call failed or timed out. Using local fallback.", error);
        incomingJobs = jobsData.matches;
        // setJobs(jobsData.matches); // Load local jobs
        setResume_skills(jobsData.resume_skills);
        setWord_cloud_skills_freq(jobsData.word_cloud_skills_freq);
        setSalaryTrends(jobsData.salaryTrend);
        setResumeProfile(jobsData.resumeProfile);
      }
      finally {
        const normalizedResumeSkills = resume_skills.map(skill => skill.toLowerCase());
      
        const sortedJobs = [...incomingJobs]
          .map(job => {
            const normalizedJobSkills = (job.skills || []).map(skill => skill.toLowerCase());
      
            let counter = 0;
            for (let i = 0; i < normalizedResumeSkills.length; i++) {
              const skillResume = normalizedResumeSkills[i];
              for (let j = 0; j < normalizedJobSkills.length; j++) {
                const skillJob = normalizedJobSkills[j];
                if (skillJob === skillResume) {
                  counter += 1;
                  break;
                }
              }
            }
      
            const skillMatchScore = normalizedJobSkills.length > 0
              ? Math.min((counter / normalizedJobSkills.length) * 1.5, 1) * 100
              : 0;
      
            return {
              ...job,
              __skillMatchScore: skillMatchScore, // Attach for sorting
            };
          })
          .sort((a, b) => {
            // First by skill match, then by matchScore
            if (b.__skillMatchScore !== a.__skillMatchScore) {
              return b.__skillMatchScore - a.__skillMatchScore;
            }
            return b.matchScore - a.matchScore;
          });
          
        const lastSortedJobs = [...sortedJobs].sort((a, b) => Math.round(b.matchScore) - Math.round(a.matchScore));
        setJobs(lastSortedJobs);
        setLoading(false);
      }
      
    };

    sendFileToAPI();
  }, [uploadedFile]);

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

  // 1. Normalize to lowercase
  const normalizedResumeSkills = resume_skills.map(skill => skill.toLowerCase());
  const normalizedJobSkills = (jobs[jobIndex]?.skills || []).map(skill => skill.toLowerCase());

  // 2. Calculate matched skills
  const matchedSkills = normalizedJobSkills.filter(skill =>
    normalizedResumeSkills.includes(skill)
  );

  // 3. Compute the match percentage
  /*const skillMatchScore = normalizedJobSkills.length > 0
    ? (matchedSkills.length / normalizedJobSkills.length) * 100
    : 0;
*/

  const skillMatchScore = normalizedJobSkills.length > 0
    ? (() => {
        let counter = 0;
        for (let i = 0; i < normalizedResumeSkills.length; i++) {
          const skillResume = normalizedResumeSkills[i];
          for (let j = 0; j < normalizedJobSkills.length; j++) {
            const skillJob = normalizedJobSkills[j];
            if (skillJob === skillResume) {
              counter += 1;
              break;
            }
          }
        }
        return Math.min((counter / normalizedJobSkills.length)*1.5,1) * 100;
      })()
    : 0;

  const getIndustryExperience = (industry, experienceByIndustry) => {
    return experienceByIndustry?.[industry] ?? 0;
  }

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
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)' }}>
          <AppBarTip
            filename={fileName}
            file={uploadedFile}
            showSummary={showSummary}
            onToggleSummary={() => setShowSummary(prev => !prev)}
            userName={resumeProfile.name}
          />
          <Grid size={12} >
                {showSummary && (
                    <ResumeSummary
                      jobCount={jobs.length}
                      resumeSkills={resume_skills}
                      skillMatchScore={skillMatchScore}
                      totalYearsExperience={resumeProfile.totalYearsExperience}
                      totalYearsEducation={resumeProfile.totalYearsEducation}
                      industriesWorkedIn={resumeProfile.industriesWorkedIn}
                      latestExperienceTitle={resumeProfile.latestExperienceTitle}
                      latestEducationLevel={resumeProfile.latestEducationLevel}
                      education={resumeProfile.education}
                      experience={resumeProfile.experience}
                    />
                  
                )}
          </Grid>

          <Grid size={4} container spacing={2} sx={{ height: '100%', flexWrap: 'wrap', alignContent: 'flex-start' }}>
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflowY: 'auto',
                border: '1px solid #ccc',
                position: 'relative',
                height: 960,
                p: 4,
                borderRadius: 4,
              }}
              elevation={3}
            >
              <JobDetailView job={jobs[jobIndex]} index={jobIndex}/>
              <Stack direction="row" spacing={2} mt={2} justifyContent="center">
                <Button variant="outlined" onClick={handlePrevious}>Previous</Button>
                <Button variant="contained" onClick={handleNext}>Next</Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={8} container spacing={2} sx={{ height: '100%', flexWrap: 'wrap', alignContent: 'flex-start' }}>
            <Grid size={4} paddingX={1} sx={{ minHeight: 300 }}>
              <GraphContainer>
                <Typography variant="h5" gutterBottom color="rgb(0,93,189)">Match Score</Typography>
                <br /><br />
                <MatchScoreChart
                  overall={100 * jobs[jobIndex].matchScore}
                  experience={Math.min(Math.abs(Math.min((resumeProfile.totalYearsExperience / parseYears(jobs[jobIndex].experience)[1]-parseYears(jobs[jobIndex].experience)[0]) * 100, 100)),100)}
                  skill={skillMatchScore}
                  industry={Math.min(Math.abs(Math.min((resumeProfile.totalYearsExperience / parseYears(jobs[jobIndex].experience)[1]-parseYears(jobs[jobIndex].experience)[0]) * 100, 100)),100)}
                />
              </GraphContainer>
            </Grid>

            <Grid size={4} paddingX={1} sx={{ minHeight: 300 }}>
              <GraphContainer>
                <Typography variant="h5" gutterBottom color=" rgb(255,133,0)">Exp. & Salary: {jobs[jobIndex]?.jobTitle}</Typography>
                {(() => {
                  const title = jobs[jobIndex]?.jobTitle;
                  const progression = salaryTrends[title]?.progression || {};
                  return <JobComparisonChart progression={progression} />;
                })()}
              </GraphContainer>
            </Grid>

            <Grid size={4} paddingX={1} sx={{ minHeight: 300 }}>
              <GraphContainer>
                <Typography variant="h5" color=" rgb(255,133,0)">Location: {jobs[jobIndex]?.jobTitle}</Typography>
                {(() => {
                  const title = jobs[jobIndex]?.jobTitle;
                  const stateData = salaryTrends[title]?.location || {};
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
            </Grid>

            <Grid size={8} paddingX={1} sx={{ minHeight: 300 }}>
              <GraphContainer>
                <Typography variant="h5" gutterBottom color="rgb(0,93,189)">Skill Frequency</Typography>
                <SkillFrequencyChart job={jobs[jobIndex]} jobs={jobs} />
              </GraphContainer>
            </Grid>

            <Grid size={4} paddingX={1} sx={{ minHeight: 300 }}>
              <GraphContainer>
                <Typography variant="h5" gutterBottom color="rgb(0,93,189)">Benefit Coverage</Typography>
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
