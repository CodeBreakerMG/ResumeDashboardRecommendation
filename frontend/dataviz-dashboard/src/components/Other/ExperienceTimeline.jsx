/*import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography, Paper } from '@mui/material';

const formatDateToMonthYear = (input) => {
  // Include the robust version from earlier
};

const ExperienceTimeline = ({ experience = [] }) => {
  return (
    <Timeline position="alternate">
      {experience.map((job, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent sx={{ flex: 0.2, py: '12px' }}>
            <Typography variant="body2" color="text.secondary">
              {formatDateToMonthYear(job.startDate)} – {formatDateToMonthYear(job.endDate)}
            </Typography>
          </TimelineOppositeContent>

          <TimelineSeparator>
            <TimelineDot color="primary" />
            {index !== experience.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent>
            <Paper elevation={3} sx={{ p: 2, bgcolor: '#f5faff' }}>
              <Typography variant="h6" fontWeight={600} color="primary">
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.company}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ExperienceTimeline;
*/