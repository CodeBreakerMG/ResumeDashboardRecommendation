import React, { useMemo, useRef, useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Grid } from '@mui/material';

const parseYears = (exp) => {
  const match = exp.match(/\d+/g);
  if (!match) return 0;
  const nums = match.map(Number);
  return nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0];
};

const parseSalary = (sal) => {
  const match = sal.match(/\d+/g);
  if (!match) return 0;
  const nums = match.map(Number);
  return nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0];
};

const JobComparisonChart = ({ job, jobs }) => {
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
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { avgExperience, avgSalary, jobExp, jobSalary } = useMemo(() => {
    let expSum = 0;
    let salarySum = 0;
    let count = 0;

    jobs.forEach(j => {
      const exp = parseYears(j.experience);
      const sal = parseSalary(j.salaryRange);
      if (!isNaN(exp) && !isNaN(sal)) {
        expSum += exp;
        salarySum += sal;
        count++;
      }
    });

    return {
      avgExperience: expSum / count,
      avgSalary: salarySum / count,
      jobExp: parseYears(job?.experience),
      jobSalary: parseSalary(job?.salaryRange),
    };
  }, [jobs, job]);

  return (
    <div ref={containerRef} style={{ width: '99%', height: '90%' }}>
      <Grid container>
        <BarChart
          xAxis={[
            {
              id: 'metrics',
              data: ['Years of Exp.', 'Salary (k$)'],
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: [avgExperience, avgSalary],
              label: 'Avg All Jobs',
              color: '#cccccc',
            },
            {
              data: [jobExp, jobSalary],
              label: 'Selected Job',
              color: '#005dab',
            },
          ]}
          width={size.width}
          height={size.height}
          grid={{ vertical: true }}
        />
        
      </Grid>
    </div>
  );
};

export default JobComparisonChart;
