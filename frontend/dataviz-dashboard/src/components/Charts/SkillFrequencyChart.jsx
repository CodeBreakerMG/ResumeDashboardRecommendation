import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

const SkillFrequencyChart = ({ job, jobs }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { skillCounts, maxCount, allSkills, selectedSet } = useMemo(() => {
    const counts = {};
    jobs.forEach(j => {
      j.skills?.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    });

    const selectedSkills = new Set(job?.skills || []);
    const sortedSkills = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([skill]) => skill);

    const max = Math.max(...Object.values(counts));

    return {
      skillCounts: counts,
      maxCount: max,
      allSkills: sortedSkills,
      selectedSet: selectedSkills,
    };
  }, [job, jobs]);

  const getColor = (count) => {
    const intensity = count / maxCount;
    const red = Math.floor(255 * intensity);
    return `rgb(${red}, 60, 60)`;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 1,
          width: '100%',
        }}
      >
        {allSkills.map((skill) => {
          const count = skillCounts[skill];
          const isSelected = selectedSet.has(skill);

          return (
            <Tooltip key={skill} title={`${skill}: ${count} occurrence(s)`}>
              <Box
                sx={{
                  height: 60,
                  backgroundColor: getColor(count),
                  color: isSelected ? 'white' : 'black',
                  border: isSelected ? '3px solid #0077ff' : '1px solid #ccc',
                  borderRadius: 2,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '6px',
                }}
              >
                {skill}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default SkillFrequencyChart;
