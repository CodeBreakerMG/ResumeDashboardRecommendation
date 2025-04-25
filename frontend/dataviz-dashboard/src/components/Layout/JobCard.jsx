import React from 'react';
import { Typography, Paper } from '@mui/material';

import formatDateToMonthYear from '../../utils/formatDateToMonthYear';

const JobCard = ({ title, company, startDate, endDate }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 0.5,
        pl: 1,
        borderRadius: 2,
        borderLeft: '6px solid rgb(0,164,196)',
        bgcolor: '#fcfcfc',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.015)',
        }
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ color: 'rgb(0,93,171)' }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'rgb(0,170,230)' }}
      >
        {company} | {formatDateToMonthYear(startDate)} – {formatDateToMonthYear(endDate)}
      </Typography>
    </Paper>
  );
};

export default JobCard;



/*
<Typography
variant="subtitle1"
fontWeight={600}
sx={{ color: 'rgb(0,93,171)' }} // newblue
>
{title}
</Typography>
<Typography
variant="body2"
sx={{ color: 'rgb(0,170,230)' }} // goodgreen
>
{company} | {startDate} - {endDate}
</Typography>
*/