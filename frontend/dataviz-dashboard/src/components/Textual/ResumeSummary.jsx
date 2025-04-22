import React from 'react';
import { Box, Typography, Paper, Stack, Grid, Divider, Chip} from '@mui/material';
import NumberBadge from '../Other/NumberBadge';
import JobCard from '../Other/JobCard';
import DescriptionIcon from '@mui/icons-material/Description';
import SkillWordCloud from '../Charts/SkillWordCloud';
import EducationCard from '../Other/EducationCard';

const ResumeSummary = ({
  jobCount = 10,
  resumeSkills = ["python", "c++", "c", "kotlin", "java", "sql", "nosql", "javascript", "data cleansing & mining"],
  skillMatchScore = 0.14,
  totalYearsExperience = 4,
  totalYearsEducation = 4,
  industriesWorkedIn = ["Finance", "Software Development", "Consulting"],
  latestExperienceTitle = "Senior Data Engineer",
  latestEducationLevel = "Bachelor's",
  publications = 0,
  education = [],
  experience = []
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        
        
        <Grid container wrap="nowrap" spacing={2} alignItems="flex-start">

        <Grid item sx={{ width: '12.5%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              height: '100%',     // ensures vertical centering within the grid row
              minHeight: 200      // optional: ensures visible height if content is small
            }}
          >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={600} lineHeight={1.2}>
                        Resume
                      </Typography>
                      <Typography variant="h4" fontWeight={600} lineHeight={1.2}>
                        Overview
                      </Typography>
                    </Box>
                  </Box>
                </Box>
          </Grid>
          
          <Divider orientation="vertical" flexItem />
          
          {/* Number Badges */}
          <Grid item sx={{ width: '20%' , }}>
          <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">Summary</Typography>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid size={6}>
                <NumberBadge color="rgb(255,133,0)" value={jobCount} label="Job Matches" scale={1} />
              </Grid>
              <Grid size={6}>
                <NumberBadge color="rgb(122,181,29)" value={Math.round(totalYearsExperience)} label="Years of Exp." scale={1} />
              </Grid>
              <Grid size={6}>
                <NumberBadge color="rgb(0,93,171)" value={Math.round(totalYearsEducation)} label="Years of Education" scale={1} />
              </Grid>
              <Grid size={6}>
                <NumberBadge color="rgb(252,196,0)" value={Math.round(publications)} label="Publications" scale={1} />
              </Grid>
            </Grid>
          </Grid>

          <Divider orientation="vertical" flexItem />
          {/* Work Experience */}
          {experience.length > 0 && (
            <Grid item sx={{ width: '25%' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">Work Experience</Typography>
              <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
                <Stack spacing={0.5}>
                {experience.map((job, idx) => (
                  <JobCard
                    key={idx}
                    title={job.title}
                    company={job.company}
                    startDate={job.startDate}
                    endDate={job.endDate}
                  />
                ))}
                </Stack>
              </Box>
            </Grid>
          )}


<Divider orientation="vertical" flexItem />
          {/* Education */}
          {education.length > 0 && (
            <Grid item sx={{ width: '20%' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">Education</Typography>
              <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
                <Stack spacing={0.5}>
                  {education.map((educ, idx) => (
                    <EducationCard
                      key={idx}
                      degree={educ.degree}
                      major={educ.major}
                      institution={educ.institution}
                      endDate={educ.endDate}
                    />
                  ))}
                  </Stack>
              </Box>
            </Grid>
          )}


<Divider orientation="vertical" flexItem />
          {/* Industries */}
          <Grid item sx={{ width: '15%' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">Industries</Typography>
            <Box sx={{ border: '1px solid #ccc', height: 200, width: '100%', overflow: 'hidden', borderRadius: 2 }}>
              {industriesWorkedIn.map((industry, idx, arr) => (
                <Box
                  key={idx}
                  sx={{
                    height: `${100 / arr.length}%`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `hsl(${(idx * 80) % 360}, 70%, 90%)`,
                    borderBottom: idx < arr.length - 1 ? '1px solid #aaa' : 'none',
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>{industry}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

     
          <Divider orientation="vertical" flexItem />
          {/* Skills */}
          <Grid item sx={{ width: '27.5%' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">Skills</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1, flex: 3 }}>
              <Box sx={{ maxHeight: 200, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {resumeSkills.map((skill, idx) => (
                  <Chip 
                    key={idx} 
                    label={skill} 
                    sx={{ 

                      bgcolor: 'rgb(122,181,29)',
                      fontSize: '14px' ,
                      fontWeight: 'bold',
                      color: '#fff' ,
                      p: 0.5,
                      pl: 1,
                      borderRadius: 2,
                      //borderLeft: '6px solid rgb(255,78,20)',
                       //border: '1px solid rgb(122,181,29)',
                       
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.015)'
                     }} }
 
                    />
                ))}
              </Box> 
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
};

export default ResumeSummary;



/*
<Box sx={{ maxHeight: '100%', overflowY: 'auto', pr: 1 }}>
              <SkillWordCloud
                job={{ skills: resumeSkills }}
                jobs={[{ skills: resumeSkills }]}
              />
            </Box>
*/ 