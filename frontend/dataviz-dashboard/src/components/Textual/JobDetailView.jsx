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


//const result = value != null ? value : defaultValue;
//JOB PARAMETERS:
//Header
const jobTitle = job.jobTitle != null ? job.jobTitle : 'JobTitle';
const location = job.location != null ? job.location : 'ExampleLocation';
const companyName = job.company != null ? job.company : 'ExampleCompany';

//FirstBody - Core Info
const experience = job.experience != null ? job.experience : '0 to 1 Year';
const qualifications = job.qualifications != null ? job.experience : 'NOT_RETRIEVED';
const salaryRange = job.salaryRange != null ? job.salaryRange : '0K$';
const workType = job.workType != null ? job.workType : '0K$';
const jobPostingDate = job.jobPostingDate != null ? job.jobPostingDate : '0K$';
const role = job.role != null ? job.role : '0K$';
const preference = job.preference != null ? job.preference : 'OnSite';

//SecondBODY Skills, Job Description and Responsibilities
const skills = job.skills != null ? job.skills : ['Skill1', 'Skill2'];
const jobDescription = job.jobDescription != null ? job.jobDescription : 'NO DESCRIPTION';
const responsibilities = job.responsibilities != null ? job.responsibilities : '0K$';
 
//Company Profile
const companySector    = job.companyProfile.Sector != null ? job.companyProfile.Sector : 'NO SECTOR';
const companyIndustry  = job.companyProfile.Industry   != null ? job.companyProfile.Industry   : 'NO SECTOR';
const companyCity      = job.companyProfile.City  != null ? job.companyProfile.City  : 'NO SECTOR';
const companyState     = job.companyProfile.State  != null ? job.companyProfile.State  : 'NO SECTOR';
const companyZip       = job.companyProfile.Zip != null ? job.companyProfile.Zip : 'NO SECTOR';
const companyWebsite   = job.companyProfile.Website != null ? job.companyProfile.Website : 'NO SECTOR';
const companyTicker    = job.companyProfile.Ticker  != null ? job.companyProfile.Sector : 'NO SECTOR';  
const companyCEO       = job.companyProfile.CEO != null ? job.companyProfile.CEO : 'NO SECTOR';
const companyContactPerson       = job.companyProfile.contactPerson != null ? job.companyProfile.contactPerson : 'NO SECTOR';
const companyContact       = job.companyProfile.contact != null ? job.companyProfile.contact : 'NO SECTOR';

return (
  <Box>
    {/* Job Header */}
    <Typography variant="h5" fontWeight="bold">
      {jobTitle}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      {companyName} • {location}
    </Typography>

    <Divider sx={{ my: 3 }} />

    {/* Core Info */}
    <Box mb={2}>
      <Typography><strong>Experience:</strong> {experience}</Typography>
      <Typography><strong>Qualifications:</strong> {qualifications}</Typography>
      <Typography><strong>Salary Range:</strong> {salaryRange}</Typography>
      <Typography><strong>Work Type:</strong> {workType}</Typography>
      <Typography><strong>Posted On:</strong> {jobPostingDate}</Typography>
      <Typography><strong>Role:</strong>  {role}</Typography>
      <Typography><strong>Setting:</strong>  {preference}</Typography>
    </Box>

    <Divider sx={{ my: 3 }} />

    {/* Skills */}
    <Box mb={3}>
      <Typography variant="h6">Skills</Typography>
      {skills.map((skill, idx) => (
        <Chip key={idx} label={skill} sx={{ mr: 1, mb: 1 }} />
      ))}
    </Box>
    
    {/* Job Description */}
    <Box mb={3}>
      <Typography variant="h6">Description</Typography>
      <Typography>{jobDescription}</Typography>
    </Box>

    {/* Responsibilities */}
    <Box mb={3}>
      <Typography variant="h6">Responsibilities</Typography>
      <Typography>{responsibilities}</Typography>
    </Box>

    {/* Company Profile */}
    <Box>
      <Typography variant="h6">Company Profile</Typography>
      <Typography><strong>Sector:</strong> {companySector}</Typography>
      <Typography><strong>Industry:</strong> {companyIndustry}</Typography>
 
      <Typography><strong>Website:</strong> <a href={`https://${companyWebsite}`} target="_blank" rel="noreferrer">{companyWebsite}</a></Typography>
      <Typography><strong>Contact Person :</strong>{companyContactPerson} • {companyContact}</Typography>
 
    </Box>
  </Box>
);
};

export default JobDetailView;
