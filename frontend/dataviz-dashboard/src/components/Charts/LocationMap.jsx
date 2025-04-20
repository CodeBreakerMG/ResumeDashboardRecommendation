// src/components/Charts/LocationMap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import usStatesData from '../../assets/us-states.json';

const defaultCenter = [39.8283, -98.5795];

const nameToAbbr = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT',
  'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL',
  'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME',
  'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI',
  'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM',
  'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR',
  'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX',
  'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA',
  'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI',
  'Wyoming': 'WY'
};

export default function LocationMap({ location, stateSalaryData = {} }) {
  const [selectedState, setSelectedState] = useState(null);
  const [hasValidated, setHasValidated]   = useState(false);

  const [minVal, maxVal] = useMemo(() => {
    const vals = Object.values(stateSalaryData);
    return vals.length
      ? [Math.min(...vals), Math.max(...vals)]
      : [0, 1];
  }, [stateSalaryData]);

  useEffect(() => {
    if (!location) return;
    const parts = location.split(',').map(s => s.trim().toUpperCase());
    const code  = parts[parts.length - 1];
    setSelectedState(stateSalaryData.hasOwnProperty(code) ? code : null);
    setHasValidated(true);
  }, [location, stateSalaryData]);

  const getColorForSalary = salary => {
    let norm = (salary - minVal) / (maxVal - minVal);
    norm = Math.max(0, Math.min(1, norm));
    const blue = [0, 0, 255], orange = [255, 165, 0];
    const rgb  = blue.map((c, i) =>
      Math.round(c + (orange[i] - c) * norm)
    );
    return `rgb(${rgb.join(',')})`;
  };

  const styleFeature = feature => {
    const fullName = feature.properties.name;
    const abbr     = nameToAbbr[fullName];
    const salary   = stateSalaryData[abbr];
    const isSel    = abbr === selectedState;
    return {
      fillColor:   salary != null ? getColorForSalary(salary) : '#ccc',
      fillOpacity: salary != null ? 0.7 : 0.3,
      weight:      isSel ? 3 : 1,
      color:       isSel ? '#000' : '#666',
      dashArray:   isSel ? '4' : ''
    };
  };

  const onEach = (feature, layer) => {
    const name   = feature.properties.name;
    const abbr   = nameToAbbr[name];
    const sal    = stateSalaryData[abbr];
    const isSel  = abbr === selectedState;

    let html = `<strong>${name} (${abbr})</strong><br/>`;
    html += sal != null
      ? `Avg: \$${(sal * 1000).toLocaleString()}`
      : 'No data';
    if (isSel) html += '<br/><em>(current job)</em>';

    layer.bindPopup(html);
    layer.on({
      mouseover: () => layer.openPopup(),
      mouseout:  () => layer.closePopup()
    });
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <MapContainer
        center={defaultCenter}
        zoom={4}
        style={{ width: '100%', height: '80%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={usStatesData}
          style={styleFeature}
          onEachFeature={onEach}
        />
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        background: 'white',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 0 6px rgba(0,0,0,0.3)',
        fontSize: '0.85rem',
        zIndex: 1000,
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: 4 }}>Salary scale</div>
        <div style={{
          width: '100%',
          height: 12,
          background: 'linear-gradient(to right, rgb(0,0,255), rgb(255,165,0))',
          margin: '0 auto 4px'
        }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 4px'
        }}>
          <span>{minVal.toFixed(1)}k</span>
          <span>{maxVal.toFixed(1)}k</span>
        </div>
      </div>

      {hasValidated && selectedState === null && (
        <div style={{ padding: 8, color: 'red' }}>
          “{location}” has no salary data
        </div>
      )}
    </div>
  );
}
