import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import SkillWordCloud from '../Charts/SkillWordCloud';
import NumberBadge from '../Other/NumberBadge';
import { styled } from '@mui/material/styles';


const CustomTypography = styled(Typography)`
  font-size: 30px;
  font-weight: bold;
  color: rgb(255,133,0);
  margin-bottom: 10px;
`;


const OldResumeSummary = ({ resumeSkills = [], summary = {} }) => {
  const {
    name = "John Doe",
    title = "Computer Science Graduate",
    numJobs = 3,
    yearsOfExperience = 2.5,
  } = summary;

  return (
    <Paper
      sx={{
        width: '100%',
        height: 200,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 4,
        mb: 2,
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom>
        Resume Summary
      </Typography>

      <Grid container spacing={2}>
 
        <Grid size={3}>
          <Typography><strong>Name:</strong> {name}</Typography>
          <Typography><strong>Title:</strong> {title}</Typography>
          <Typography><strong># of Jobs:</strong> {numJobs}</Typography>
          <Typography><strong>Years of Experience:</strong> {yearsOfExperience}</Typography>
        </Grid>

        <Grid size={3}>
            <NumberBadge color="#cc4a04" value="20%" label="Of match" />
        </Grid>

        <Grid size={3}>
          <Box sx={{ height: '55%' }}>
            <SkillWordCloud
              job={{ skills: resumeSkills }}
              jobs={[{ skills: resumeSkills }]}
            />
          </Box>
        </Grid>
 
        <Grid size={3}>
          <Box sx={{ height: '85%' }}>
            <SkillWordCloud
              job={{ skills: resumeSkills }}
              jobs={[{ skills: resumeSkills }]}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OldResumeSummary;
