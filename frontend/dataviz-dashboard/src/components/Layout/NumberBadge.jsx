import { Box, Typography } from '@mui/material';

const NumberBadge = ({ color = '#f47c32', value = '20%', label = 'Of match', scale = 1 }) => {
  return (
    <Box
      sx={{
        border: `2px solid ${color}`,
        borderRadius: '16px',
        padding: `${8 * scale}px ${16 * scale}px`,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: `100%`,
        width: `80%`,
        minWidth: '80px',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: color,
          fontSize: `${24 * scale}px`,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          marginTop: `${4 * scale}px`,
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: color,
          fontSize: `${12 * scale}px`,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default NumberBadge;
