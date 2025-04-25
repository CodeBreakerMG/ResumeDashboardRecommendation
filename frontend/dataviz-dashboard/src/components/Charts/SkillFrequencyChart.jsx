import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Box, Tooltip } from '@mui/material';

/**
 * SkillFrequencyChart Component
 * Displays a grid-based heatmap showing the frequency of skills across all jobs.
 * Highlights skills required by the selected job.
 * 
 * Props:
 * - job:         Current selected job object
 * - jobs:        Array of all job objects
 * - isExpanded:  Boolean flag to control grid size (show more skills when expanded)
 */
const SkillFrequencyChart = ({ job, jobs, isExpanded }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: '97%', height: '100%' });

  // === Handle Responsive Container Sizing ===
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    handleResize();  // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === Compute Skill Frequencies & Selected Job Skills ===
  const { skillCounts, maxCount, allSkills, selectedSet } = useMemo(() => {
    const counts = {};

    jobs.forEach(j => {
      j.skills?.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    });

    const selectedSkills = new Set(job?.skills || []);

    let sortedSkills = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([skill]) => skill);

    // Limit to top 32 skills when not expanded
    if (!isExpanded) {
      sortedSkills = sortedSkills.slice(0, 32);
    }

    const max = Math.max(...Object.values(counts));

    return {
      skillCounts: counts,
      maxCount: max,
      allSkills: sortedSkills,
      selectedSet: selectedSkills,
    };
  }, [job, jobs, isExpanded]);

  // === Determine Cell Color Based on Frequency ===
  const getColor = (count) => {
    const intensity = count / maxCount;
    const green = 255 - Math.min(122, Math.floor(122 * intensity * 1.5));
    //const red = 255 - Math.floor(255 * intensity);
    return `rgb(255, ${green}, 0)`;  // Gradient from red to yellow-green
  };

  // === Render Skill Frequency Heatmap Grid ===
  return (
    <Box
      ref={containerRef}
      sx={{
        width: size.width,
        height: size.height,
        overflowY: 'auto',
        padding: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',  // Max 8 cells per row
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
                  border: isSelected ? '5px solid #0077ff' : '1px solid #ccc',
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
