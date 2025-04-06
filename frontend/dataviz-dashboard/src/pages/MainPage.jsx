import React from 'react'; //This is the React Base module
import { Box, Grid, Typography, Paper  } from '@mui/material'; //Base Material UI Components https://mui.com/material-ui/react-box/
import JobDetailView from '../components/Textual/JobDetailView';
import AppBarTip from '../components/Other/AppBarTip';
import GraphContainer from '../components/Other/GraphContainer';
import LocationMap from '../components/Charts/LocationMap';

const someJob = {
  title: "Retail Customer Service Team Member",
  company: "Michaels",
  location: "Canton, OH, USA",
  categories: ["Customer Experience", "Customer Support"],
  requirements: ["Deliver friendly customer service", "Handle cash"],
  responsibilities: ["Assist with stocking", "Support shrink and safety"],
};

const someDetailedJob = {
  "jobId": "1372845428869057",
  "experience": "1 to 9 Years",
  "qualifications": "PhD",
  "salaryRange": "$56K-$128K",
  "location": "Ohio",
  "country": "USA",
  "latitude": 41.6086,
  "longitude": 21.7453,
  "workType": "Temporary",
  "companySize": 29012,
  "jobPostingDate": "2022-06-21",
  "preference": "Both",
  "contactPerson": "Carmen Taylor",
  "contact": "(771)379-2825x765",
  "jobTitle": "Family Nurse Practitioner",
  "role": "Primary Care Provider",
  "jobPortal": "Stack Overflow Jobs",
  "jobDescription": "Primary Care Providers offer general medical care to patients. They diagnose and treat common health issues, perform check-ups, and refer patients to specialists as needed.",
  "benefits": [
    "Flexible Spending Accounts (FSAs)",
    "Relocation Assistance",
    "Legal Assistance",
    "Employee Recognition Programs",
    "Financial Counseling"
  ],
  "skills": [
    "Medical diagnosis",
    "Patient care",
    "Medical record-keeping",
    "Communication skills",
    "Empathy and compassion"
  ],
  "responsibilities": "Provide primary healthcare to patients, including diagnosis, treatment, and preventive care. Conduct physical exams and health assessments. Order and interpret diagnostic tests.",
  "company": "Kingfisher plc",
  "companyProfile": {
    "Sector": "Retail",
    "Industry": "Retail - Home Improvement",
    "City": "London",
    "State": "N/A",
    "Zip": "N/A",
    "Website": "www.kingfisher.com",
    "Ticker": "KGF.L",
    "CEO": "Thierry Garnier"
  }
}


const MainPage = () => {
  return (
    <Grid container spacing={2}>
      <AppBarTip/>
      <Grid size={12}>
        <Typography>ResumeParser</Typography>
      </Grid>
      <Grid size={4}>
        <JobDetailView job={someDetailedJob} />
      </Grid>
      <Grid size={8} container  >
        <Grid size={4} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5">Hello World</Typography>
          </GraphContainer>
        </Grid>
        <Grid size={4} paddingX={1}>
          <GraphContainer>
            <Typography variant="h5">Location</Typography>
            <LocationMap/>
          </GraphContainer>
        </Grid>
      </Grid>
    </Grid>
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