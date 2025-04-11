import React, { useMemo, useRef, useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const MAX_DISPLAYED_SKILLS = 10

const SkillFrequencyChart = ({ jobs }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    handleResize(); // initial size
    window.addEventListener('resize', handleResize); // update on resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { inverseSortedSkills } = useMemo(() => {
    const skillCount = {};
    jobs.forEach(job => {
      job.skills?.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    const sortedSkills = Object.entries(skillCount)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_DISPLAYED_SKILLS);

    const inverseSortedSkills = [...sortedSkills].sort((a, b) => a.count - b.count);
    return { inverseSortedSkills };
  }, [jobs]);

  return (
    <div ref={containerRef} style={{ width: '99%', height: '90%' }}>
      <BarChart
        dataset={inverseSortedSkills}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'skill',
            tickLabelStyle: {
              angle: -90,
              textAnchor: 'end',
            },
          },
        ]}
        yAxis={[{ label: 'Frequency' }]}
        series={[
          {
            dataKey: 'count',
           
            color: '#1976d2',
          },
        ]}
        width={size.width}
        height={size.height}
        sx={{
          [`& .${axisClasses.root}`]: {
            stroke: '#8884d8',
          },
        }}
      />
    </div>
  );
};

export default SkillFrequencyChart;
