// JobComparisonChart.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Grid, Typography } from '@mui/material';

/**
 * JobComparisonChart Component
 * Displays a responsive Line Chart showing salary progression based on years of experience.
 * 
 * Props:
 * - progression: An object mapping years to salary values.
 */
export default function JobComparisonChart({ progression }) {
  const ref = useRef();
  const [size, setSize] = useState({ width: 400, height: 300 });

  // === Handle Responsive Resizing ===
  useEffect(() => {
    const onResize = () => {
      if (!ref.current) return;
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    };
    onResize();  // Initial sizing
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // === Process Progression Data into Chart-Friendly Arrays ===
  const { years, salaries } = useMemo(() => {
    if (!progression) return { years: [], salaries: [] };

    const pts = Object.entries(progression)
      .map(([yr, sal]) => [parseFloat(yr), parseFloat(sal)])
      .sort(([a], [b]) => a - b);  // Sort by year ascending

    return {
      years: pts.map(([y]) => y),
      salaries: pts.map(([, s]) => s),
    };
  }, [progression]);

  const chartW = size.width;
  const chartH = size.height;

  // === Fallback if No Data ===
  if (!years.length) {
    return <Typography>No salary trend data available.</Typography>;
  }

  // === Render Responsive Line Chart ===
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid container>
        <LineChart
          width={chartW}
          height={chartH}
          margin={{ top: 40, right: 20, bottom: 50, left: 40 }}
          curve="monotoneX"
          grid={{ vertical: true, horizontal: true, stroke: '#eee' }}
          slotProps={{ tooltip: { trigger: 'axis' } }}

          // === X-Axis: Years of Experience ===
          xAxis={[{
            type: 'number',
            data: years,
            label: 'Years of Experience',
            position: 'bottom',
            valueFormatter: (v, context) =>
              context.location === 'tooltip'
                ? `Years of experience: ${v} years`
                : (Number.isInteger(v) ? `${v}` : ''),
            tickLabelProps: () => ({ fontSize: 11 }),
          }]}

          // === Y-Axis: Salary in Thousands ===
          yAxis={[{
            type: 'number',
            label: 'Salary (k)',
            labelStyle: { dx: -10 },
            valueFormatter: (v) => `${Math.round(v)}k`,
            tickLabelProps: () => ({ fontSize: 11 }),
          }]}

          // === Line Series Data ===
          series={[{
            data: salaries,
            label: 'Salary',
            showMark: true,
            markSize: 6,
            lineWidth: 2,
            valueFormatter: (v) => `$${Math.round(v * 1000).toLocaleString()}`,
          }]}

          hideLegend
        />
      </Grid>
    </div>
  );
}
