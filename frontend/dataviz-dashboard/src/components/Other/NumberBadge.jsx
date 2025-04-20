import { Box, Typography } from '@mui/material';

const NumberBadge = ({ color = '#f47c32', value = '20%', label = 'Of match' }) => {
  return (
    <Box
      sx={{
        border: `2px solid ${color}`,
        borderRadius: '16px',
        padding: '16px 32px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', // optional, or use transparent
        height: '50%'
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: color,
         
          padding: '4px 12px',
          fontSize: '3rem',
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          marginTop: 1,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: color,
          fontSize: '1rem',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default NumberBadge;
