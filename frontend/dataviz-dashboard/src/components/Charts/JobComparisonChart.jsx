import React, { useMemo, useRef, useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Grid } from '@mui/material';

const parseYears = exp => {
  if (!exp) return 0;
  const nums = exp.match(/\d+/g)?.map(Number);
  return nums?.length === 2 ? (nums[0] + nums[1]) / 2 : nums?.[0] ?? 0;
};

const parseSalary = sal => {
  if (!sal) return 0;
  const text = sal.toLowerCase();
  const isHr = /hour|hr|\$\/hr/.test(text);
  const nums = sal.match(/\d+/g)?.map(Number);
  if (!nums) return 0;
  const base = nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0];
  return isHr ? base * 40 * 52 : base;
};

export default function JobComparisonChart({ job, jobs }) {
  const ref = useRef();
  const [size, setSize] = useState({ width: 400, height: 300 });

  useEffect(() => {
    const onResize = () => {
      if (!ref.current) return;
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { buckets, avgSalaries, selectedLine } = useMemo(() => {
    const buckets = [1, 2, 3, 4, 5, 6];
    const groups = Object.fromEntries(buckets.map(b => [b, { sum: 0, count: 0 }]));

    jobs.forEach(j => {
      const yrs = parseYears(j.experience);
      const b = Math.round(yrs);
      if (groups[b]) {
        const s = parseSalary(j.salaryRange);
        if (!isNaN(s)) {
          groups[b].sum += s;
          groups[b].count += 1;
        }
      }
    });

    const avgSalaries = buckets.map(b =>
      groups[b].count ? groups[b].sum / groups[b].count : 0
    );

    const jobBucket = Math.round(parseYears(job?.experience));
    const jobSal    = parseSalary(job?.salaryRange);
    const selectedLine = buckets.map(b => (b === jobBucket ? jobSal : null));

    return { buckets, avgSalaries, selectedLine };
  }, [jobs, job]);

  const chartSize = { width: size.width * 0.8, height: size.height * 0.6 };

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container>
        <LineChart
          width={chartSize.width}
          height={chartSize.height}
          margin={{ top: 80, right: 20, bottom: 20, left: 50 }}
          curve="monotoneX"                      // smooth curve
          grid={{
            vertical: true,
            horizontal: false,                  // turn off horizontal grid
            stroke: '#eee',                     // very light grid
          }}
          xAxis={[{
            data: buckets,
            label: 'Years of Experience',
            tickInterval: 1,
            min: 1,
            max: 6,
            position: 'top',
            axisLine: { stroke: '#ccc' },
            tickSize: 4,
            tickColor: '#999',
            tickLabelProps: () => ({ fill: '#666', fontSize: 11 }),
          }]}
          yAxis={[{
            label: 'Annual Salary ($)',
            valueFormatter: v => `$${v.toLocaleString()}`,
            min: 0,
            tickInterval: 20000,
            axisLine: { stroke: '#ccc' },
            tickSize: 4,
            tickColor: '#999',
            tickLabelProps: () => ({ fill: '#666', fontSize: 11 }),
          }]}
          legendPosition="top-right"             // move legend out of the way
          series={[
            {
              data: avgSalaries,
              label: 'Avg Salary (1–6 yrs)',
              showMark: true,
              markSize: 6,
              color: '#888',
              area: true,                        // fill under curve
              areaBaseValue: 0,
              areaOpacity: 0.1,
              lineWidth: 2,
            },
            {
              data: selectedLine,
              label: 'This Job',
              showMark: true,
              markSize: 16,
              color: '#d32f2f',
              markStyle: { fill: '#d32f2f', stroke: '#000', strokeWidth: 2 },
              lineWidth: 0,
            },
          ]}
        />
      </Grid>
    </div>
  );
}
