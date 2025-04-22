import React from 'react';
//import { useState } from 'react';
import { Box, Typography, Chip, Button, Paper, Divider } from '@mui/material';

const JobDetailView = ({ job, index }) => {
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
const qualifications = job.qualifications != null ? job.qualifications : 'NOT_RETRIEVED';
const salaryRange = job.salaryRange != null ? job.salaryRange : '0K$';
const workType = job.workType != null ? job.workType : 'NOT_DEFINED';
const jobPostingDate = job.jobPostingDate != null ? job.jobPostingDate : '1/1/1900';
const role = job.role != null ? job.role : 'NOT_DEFINED';
const preference = job.preference != null ? job.preference : 'NOT_DEFINED';

//SecondBODY Skills, Job Description and Responsibilities
const skills = job.skills != null ? job.skills : ['Skill1', 'Skill2'];
const jobDescription = job.jobDescription != null ? job.jobDescription : 'NO DESCRIPTION';
const responsibilities = job.responsibilities != null ? job.responsibilities : 'NOT_DEFINED';
 
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

const phoneNumbers = [
  "555-1234",
  "555-5678",
  "555-9012",
  "555-3456",
  "555-7890"
];

const cyclePhoneNumbers = (index) => {
  // Example usage:

  let newIndex = (index) % 5;
  return phoneNumbers[newIndex]

};

 


return (
  <Box>

    <Box mb={3} sx={{ display: 'flex', gap: 2 }}>
        {/* Job Header */}
        <Box sx={{ flex: 4 }}>
          <Typography variant="h5" fontWeight="bold">
            {jobTitle}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {companyName} • {location}
          </Typography>
        </Box>     
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" fontWeight="bold" align='right' color='rgb(151, 200, 240)' >
              # {index + 1}
           </Typography>

        </Box>
    </Box>
    <Divider sx={{ my: 3 }} />

    {/* Core Info + Skills in row */}
    <Box mb={3} sx={{ display: 'flex', gap: 2 }}>
      {/* Core Info */}
      <Box sx={{ flex: 2 }}>
        <Typography><strong>Experience:</strong> {experience}</Typography>
        <Typography><strong>Qualifications:</strong> {qualifications}</Typography>
        <Typography><strong>Salary Range:</strong> {salaryRange}</Typography>
        <Typography><strong>Work Type:</strong> {workType}</Typography>
        <Typography><strong>Posted On:</strong> {jobPostingDate}</Typography>
        <Typography><strong>Role:</strong>  {role}</Typography>
        <Typography><strong>Setting:</strong>  {preference}</Typography>
      </Box>
      {/* Divider */}
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      {/* Skills */}
      <Box sx={{ flex: 3 }}>
        <Typography variant="h6">Skills</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {skills.map((skill, idx) => (
            <Chip key={idx} label={skill} />
          ))}
        </Box>
      </Box>
    </Box>

    <Divider sx={{ my: 3 }} />

    {/* Job Description */}
    <Box mb={3} sx={{ maxHeight: 150, overflowY: 'auto' }}>
      <Typography variant="h6">Description</Typography>
      <Typography>{jobDescription}</Typography>
    </Box>


    {/* Responsibilities */}
    <Box mb={3} sx={{ maxHeight: 150, overflowY: 'auto' }}>
      <Typography variant="h6">Responsibilities</Typography>
      <Typography>{responsibilities}</Typography>
    </Box>

    <Divider sx={{ my: 3 }} />

    {/* Company Profile */}
    <Box>
      <Typography variant="h6">Company Profile</Typography>
      <Typography><strong>Sector:</strong> {companySector}</Typography>
      <Typography><strong>Industry:</strong> {companyIndustry}</Typography>
 
      <Typography><strong>Website:</strong> <a href={`https://${companyWebsite}`} target="_blank" rel="noreferrer">{companyWebsite}</a></Typography>
      <Typography><strong>Contact Person: </strong>{companyCEO} • {cyclePhoneNumbers(index)}</Typography>
 
    </Box>
  </Box>
);
};

export default JobDetailView;
