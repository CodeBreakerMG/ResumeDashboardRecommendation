import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const CircularMatch = ({ value, label, size = 80, color = '#00cba9', thickness = 5, fontSize = 16 }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{
          color,
          position: 'absolute',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: size,
          width: size,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: fontSize }}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
      {label && (
        <Typography sx={{ fontSize: 13, marginTop: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};
const MatchScoreChart = ({ overall = 89, experience = 100, skill = 86, industry = 33, isExpanded = false }) => {
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 400, height: 300 });
  
    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) {
          const { offsetWidth, offsetHeight } = containerRef.current;
          setSize({ width: offsetWidth, height: offsetHeight });
        }
      };
  
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // 🧠 Adjust size based on expansion
    const multiplier = isExpanded ? 1.4 : 1;
    const mainSize = Math.max(120, Math.min(size.width * 0.25 * multiplier, 180));
    const miniSize = Math.max(75, Math.min(size.width * 0.15 * multiplier, 100));
    const mainFont = mainSize * 0.28;
  
    return (
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          height: '100%',
          overflowY: 'auto',
          padding: 1,
        }}
      >
        <CircularMatch value={overall} label="STRONG MATCH" size={mainSize} fontSize={mainFont} />
  
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <CircularMatch value={experience} label="Exp. Level" size={miniSize} fontSize={miniSize * 0.3} />
          <CircularMatch value={skill} label="Skill" size={miniSize} fontSize={miniSize * 0.3} />
          <CircularMatch value={industry} label="Industry Exp." size={miniSize} fontSize={miniSize * 0.3} />
        </Box>
      </Box>
    );
  };
  

export default MatchScoreChart;
