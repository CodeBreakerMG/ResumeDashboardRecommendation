import React from 'react';
//import { useState } from 'react';
import { Box, Typography, Chip, Button, Paper, Divider } from '@mui/material';

const JobDetailView = ({ job }) => {
  if (!job) return null;
/*
    const [tab, setTab] = useState(0);
    const handleTabChange = (e, newValue) => setTab(newValue);
*/
//    <Paper elevation={2} sx={{ p: 4, maxWidth: "100%", borderRadius: 4 }}>
return (
  <Paper
    sx={{
      height: 1000,
      overflowY: 'auto',
      p: 2,
      border: '1px solid #ccc',
      borderRadius: 4
    }}
    elevation={3}
  >
    {/* Job Header */}
    <Typography variant="h5" fontWeight="bold">
      {job.jobTitle}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      {job.company} • {job.location}
    </Typography>

    <Divider sx={{ my: 3 }} />

    {/* Core Info */}
    <Box mb={2}>
      <Typography><strong>Experience:</strong> {job.experience}</Typography>
      <Typography><strong>Qualifications:</strong> {job.qualifications}</Typography>
      <Typography><strong>Salary Range:</strong> {job.salaryRange}</Typography>
      <Typography><strong>Work Type:</strong> {job.workType}</Typography>
      <Typography><strong>Posted On:</strong> {job.jobPostingDate}</Typography>
      <Typography><strong>Coordinates:</strong> {job.latitude}, {job.longitude}</Typography>
    </Box>

    <Divider sx={{ my: 3 }} />

    {/* Skills */}
    <Box mb={3}>
      <Typography variant="h6">Skills</Typography>
      {job.skills.map((skill, idx) => (
        <Chip key={idx} label={skill} sx={{ mr: 1, mb: 1 }} />
      ))}
    </Box>

    {/* Responsibilities */}
    <Box mb={3}>
      <Typography variant="h6">Responsibilities</Typography>
      <Typography>{job.responsibilities}</Typography>
    </Box>

    {/* Company Profile */}
    <Box>
      <Typography variant="h6">Company Profile</Typography>
      <Typography><strong>Sector:</strong> {job.companyProfile.Sector}</Typography>
      <Typography><strong>Industry:</strong> {job.companyProfile.Industry}</Typography>
      <Typography><strong>City:</strong> {job.companyProfile.City}</Typography>
      <Typography><strong>Website:</strong> <a href={`https://${job.companyProfile.Website}`} target="_blank" rel="noreferrer">{job.companyProfile.Website}</a></Typography>
    </Box>
  </Paper>
);
};

export default JobDetailView;
