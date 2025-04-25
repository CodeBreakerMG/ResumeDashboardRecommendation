import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

/**
 * JobBenefitsRadarChart Component
 * Shows whether the current job includes the most common benefits across all matched jobs.
 * 
 * Props:
 * - job: current job being visualized
 * - jobs: full list of matched jobs
 */
const JobBenefitsRadarChart = ({ job, jobs }) => {
  // === Step 1: Determine Top Common Benefits Across All Jobs ===
  const topBenefits = useMemo(() => {
    const benefitCount = {};

    jobs.forEach(j => {
      j.benefits?.forEach(b => {
        benefitCount[b] = (benefitCount[b] || 0) + 1;
      });
    });

    // Return top 6 benefits sorted by frequency
    return Object.entries(benefitCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([benefit]) => benefit);
  }, [jobs]);

  // === Step 2: Build Data Points for This Job ===
  const radarData = topBenefits.map(benefit => ({
    benefit,
    hasBenefit: job?.benefits?.includes(benefit) ? 1 : 0,
  }));

  // === Step 3: Render Radar Chart ===
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius={100} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="benefit"
            style={{ fontFamily: 'Arial', fontSize: 12, color: 'black' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 1]}
            tick={false}
            style={{ fontFamily: 'Arial' }}
          />
          <Radar
            name="Job Benefits"
            dataKey="hasBenefit"
            stroke="#005DAB"
            fill="#005DAB"
            fillOpacity={0.6}
          />
          <Tooltip
            wrapperStyle={{ fontFamily: 'Arial', fontSize: 13, color: 'black' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JobBenefitsRadarChart;
