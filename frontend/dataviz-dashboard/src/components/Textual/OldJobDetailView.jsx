import React from 'react';
import { useState } from 'react';
import { Box, Typography, Chip, Button, Paper, Divider } from '@mui/material';

const OldJobDetailView = ({ job }) => {
    
/*
    const [tab, setTab] = useState(0);
    const handleTabChange = (e, newValue) => setTab(newValue);
*/
//    <Paper elevation={2} sx={{ p: 4, maxWidth: "100%", borderRadius: 4 }}>
return (
  <Paper
    sx={{
      height: 1000, // fixed height
      overflowY: 'auto', // vertical scroll if needed
      p: 2,
      border: '1px solid #ccc',
      borderRadius: 4
    }}
    elevation={3}
  >
      {/* Job Header */}
      <Typography variant="h5" fontWeight="bold">
        {job.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {job.company} • {job.location}
      </Typography>

      {/* Tags */}
      <Box my={2}>
        {job.categories.map((cat) => (
          <Chip label={cat} key={cat} sx={{ mr: 1, mb: 1 }} />
        ))}
      </Box>

      {/* Buttons */}
      <Box my={2}>
        <Button variant="contained" sx={{ mr: 2 }}>
          Apply
        </Button>
        <Button variant="outlined">Save</Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Summary Content */}
      <Box mt={2}>
        <Typography variant="h6">Requirements</Typography>
        <ul>
          {job.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>

        <Typography variant="h6" mt={3}>
          Responsibilities
        </Typography>
        <ul>
          {job.responsibilities.map((res, idx) => (
            <li key={idx}>{res}</li>
          ))}
        </ul>
      </Box>
    </Paper>

  );
};

export default OldJobDetailView;
