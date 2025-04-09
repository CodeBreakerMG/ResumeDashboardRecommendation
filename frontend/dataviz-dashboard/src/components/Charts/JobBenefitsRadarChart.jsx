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

// Props: job (object), jobs (array)
const JobBenefitsRadarChart = ({ job, jobs }) => {
  // 1. Collect all benefits and find top ones
  const topBenefits = useMemo(() => {
    const benefitCount = {};
    jobs.forEach(j => {
      j.benefits?.forEach(b => {
        benefitCount[b] = (benefitCount[b] || 0) + 1;
      });
    });

    // Sort and take top 6-8 most common benefits
    return Object.entries(benefitCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([benefit]) => benefit);
  }, [jobs]);

  // 2. Build radar data based on this job
  const radarData = topBenefits.map((benefit) => ({
    benefit,
    hasBenefit: job?.benefits?.includes(benefit) ? 1 : 0,
  }));

  return (
<div style={{ fontFamily: 'Arial, sans-serif' }}>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius={100} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="benefit" 
            style={{ fontFamily: 'Arial', fontSize: 12, color:'black' }} 
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
            wrapperStyle={{ fontFamily: 'Arial', fontSize: 13, color:'black'}} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
  
};

export default JobBenefitsRadarChart;
