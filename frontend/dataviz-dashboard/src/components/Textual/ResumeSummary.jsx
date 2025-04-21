import React from 'react';
import { Box, Typography, Paper, Stack, Chip, Divider, Grid } from '@mui/material';
import NumberBadge from '../Other/NumberBadge';
import DescriptionIcon from '@mui/icons-material/Description';


const ResumeSummary = ({
  jobCount = 10,
  resumeSkills = ["python","c++","c","kotlin","java","sql","nosql","javascript","data cleansing & mining"] ,
  skillMatchScore = 0.14,
  totalYearsExperience = 4,
  totalYearsEducation = 4 ,
  industriesWorkedIn = [ "Finance", "Software Development","Consulting" ],
  latestExperienceTitle =  "Senior Data Engineer",
  latestEducationLevel =  "Bachelor's"
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 3 }}>

      <Stack
        direction="row"
        spacing={4}
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DescriptionIcon sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Resume
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Overview
            </Typography>
          </Box>
        </Box>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Box>
          <Grid container spacing={1} sx={{ height: '100%', flexWrap: 'wrap', alignContent: 'flex-start' }}>
            <Grid size={4} paddingX={0.4}>
              <NumberBadge color="rgb(0,93,171)" value={jobCount}  label="Job Matches" scale={1} />
            </Grid>
            <Grid size={4} paddingX={0.4}>
              <NumberBadge color="rgb(255,133,0)" value={Math.round(totalYearsExperience)}  label="Years of Exp." scale={1} />
            </Grid>
            <Grid size={4} paddingX={0.4}>
              <NumberBadge color="rgb(122,181,29)" value={Math.round(totalYearsEducation)}  label="Years of Education" scale={1} />
            </Grid>
          </Grid>
        </Box>

        {/* Industry Stack */}
        <Box
          sx={{
            border: '1px solid #ccc',
            height: 200,
            width: 250,
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {industriesWorkedIn.map((industry, idx, arr) => (
            <Box
              key={idx}
              sx={{
                height: `${100 / arr.length}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `hsl(${(idx * 80) % 360}, 70%, 90%)`, // light color variation
                borderBottom: idx < arr.length - 1 ? '1px solid #aaa' : 'none',
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {industry}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Skills in Resume:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {resumeSkills.slice(0, 6).map((skill, i) => (
              <Chip key={i} label={skill} size="small" />
            ))}
            {resumeSkills.length > 6 && (
              <Chip label={`+${resumeSkills.length - 6} more`} size="small" variant="outlined" />
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ResumeSummary;
