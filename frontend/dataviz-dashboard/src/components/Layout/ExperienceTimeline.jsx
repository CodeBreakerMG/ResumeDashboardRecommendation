import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Typography, Paper, Box } from '@mui/material';

const formatDateToMonthYear = (input) => {
  if (!input) return '';

  const monthMap = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  const str = input.trim().toLowerCase().replace(/[-/]/g, ' ').replace(/\s+/g, ' ');
  const parts = str.split(' ');

  if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    return `Jan ${parts[0]}`;
  }

  if (parts.length === 2 && isNaN(parts[0])) {
    const month = monthMap[parts[0].slice(0, 3)];
    const year = parts[1].length === 2 ? '20' + parts[1] : parts[1];
    if (!isNaN(month) && /^\d{4}$/.test(year)) {
      return new Date(+year, month).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
  }

  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    let [month, year] = parts.map(Number);
    if (year < 100) year += 2000;
    if (month >= 1 && month <= 12) {
      return new Date(year, month - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
  }

  const parsed = new Date(input);
  if (!isNaN(parsed)) {
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  return input;
};

const ExperienceTimeline = ({ experience = [] }) => {
  return (
    <Box sx={{ overflowX: 'auto', py: 4 }}>
      <Timeline
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 0,
          minWidth: '1000px',
        }}
      >
        {experience.map((job, index) => (
          <TimelineItem
            key={index}
            sx={{
              flex: 1,
              minWidth: 200,
              position: 'relative',
              '&::before': {
                display: 'none',
              },
            }}
          >
            <TimelineSeparator sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <TimelineDot sx={{ backgroundColor: 'rgb(0,93,171)' }} />
              {index !== experience.length - 1 && (
                <TimelineConnector
                  sx={{
                    width: '100px',
                    height: 2,
                    backgroundColor: 'rgba(0,93,171, 0.3)',
                    mt: 1,
                    mx: 'auto',
                  }}
                />
              )}
            </TimelineSeparator>

            <TimelineContent sx={{ px: 2 }}>
              <Paper elevation={3} sx={{ p: 2, bgcolor: '#f5faff', minHeight: '100px' }}>
                <Typography variant="h6" fontWeight={600} color="primary">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateToMonthYear(job.startDate)} – {formatDateToMonthYear(job.endDate)}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default ExperienceTimeline;
