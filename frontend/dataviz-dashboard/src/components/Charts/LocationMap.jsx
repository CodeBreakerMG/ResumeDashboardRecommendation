import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import usStatesData from '../../assets/us-states.json'; // Adjust the path based on your project structure

// Default center coordinate (geographic center of the contiguous US)
const defaultCenter = [39.8283, -98.5795];

// For Validation
const stateSalaries = {
  'California': 120000,
  'New York': 110000,
  'Texas': 90000,
  'Florida': 85000,
  'Illinois': 95000,
  'Pennsylvania': 88000,
  'Ohio': 82000,
  'Georgia': 85000,
  'North Carolina': 83000,
  'Michigan': 85000,
  'New Jersey': 105000,
  'Virginia': 95000,
  'Washington': 100000,
  'Arizona': 85000,
  'Massachusetts': 110000,
  'Tennessee': 80000,
  'Indiana': 80000,
  'Missouri': 80000,
  'Maryland': 95000,
  'Wisconsin': 82000,
  'Minnesota': 90000,
  'Colorado': 95000,
  'Alabama': 75000,
  'South Carolina': 78000,
  'Louisiana': 75000,
  'Kentucky': 75000,
  'Oregon': 90000,
  'Oklahoma': 75000,
  'Connecticut': 95000,
  'Utah': 85000,
  'Iowa': 80000,
  'Nevada': 85000,
  'Arkansas': 75000,
  'Mississippi': 70000,
  'Kansas': 80000,
  'New Mexico': 75000,
  'Nebraska': 80000,
  'West Virginia': 70000,
  'Idaho': 75000,
  'Hawaii': 90000,
  'New Hampshire': 85000,
  'Maine': 80000,
  'Rhode Island': 85000,
  'Montana': 75000,
  'Delaware': 85000,
  'South Dakota': 75000,
  'North Dakota': 75000,
  'Alaska': 90000,
  'Vermont': 80000,
  'Wyoming': 75000
};

const LocationMap = ({ location }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [isValid, setIsValid] = useState(true);
//   For validation
  //location = "California"

  // Function to interpolate between blue and orange based on salary
  const getColorForSalary = (salary) => {
    const minSalary = 70000;
    const maxSalary = 120000;
    const normalizedSalary = (salary - minSalary) / (maxSalary - minSalary);
    
    // Blue to Orange color scale
    const blue = [0, 0, 255];
    const orange = [255, 165, 0];
    
    const r = Math.round(blue[0] + (orange[0] - blue[0]) * normalizedSalary);
    const g = Math.round(blue[1] + (orange[1] - blue[1]) * normalizedSalary);
    const b = Math.round(blue[2] + (orange[2] - blue[2]) * normalizedSalary);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    if (!location) {
      setSelectedState(null);
      setIsValid(false);
      return;
    }
    const locationLower = location.trim().toLowerCase();
    // Check if any state in the GeoJSON data matches the provided location.
    const found = usStatesData.features.some((feature) => {
      const featureName = (feature.properties.name || feature.properties.NAME || '').toLowerCase();
      return featureName === locationLower;
    });
    if (found) {
      setSelectedState(location);
      setIsValid(true);
    } else {
      setSelectedState(null);
      setIsValid(false);
    }
  }, [location]);

  // Style function for the heatmap with selected state highlight
  const stateStyle = (feature) => {
    const featureName = feature.properties.name || feature.properties.NAME;
    const salary = stateSalaries[featureName] || 70000;
    const color = getColorForSalary(salary);
    const isSelected = selectedState && featureName.toLowerCase() === selectedState.toLowerCase();
    
    return {
      fillColor: color,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#000000' : 'gray',
      fillOpacity: 0.7,
      dashArray: isSelected ? '3' : '0',
    };
  };

  // Enhanced popup with salary information and comparison
  const onEachState = (feature, layer) => {
    const featureName = feature.properties.name || feature.properties.NAME;
    const salary = stateSalaries[featureName] || 70000;
    const isSelected = selectedState && featureName.toLowerCase() === selectedState.toLowerCase();
    
    let comparisonText = '';
    if (isSelected && selectedState) {
      const selectedSalary = stateSalaries[selectedState];
      const nationalAverage = Object.values(stateSalaries).reduce((a, b) => a + b, 0) / Object.keys(stateSalaries).length;
      const difference = salary - nationalAverage;
      const percentage = ((difference / nationalAverage) * 100).toFixed(1);
      const comparison = difference > 0 ? 'above' : 'below';
      comparisonText = `<br/>Salary is ${Math.abs(percentage)}% ${comparison} national average`;
    }
    
    layer.bindPopup(`
      <div>
        <strong>${featureName}</strong><br/>
        Average Salary: $${salary.toLocaleString()}${comparisonText}
      </div>
    `);
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <MapContainer center={defaultCenter} zoom={4} style={{ width: '100%', height: '80%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={usStatesData} style={stateStyle} onEachFeature={onEachState} />
      </MapContainer>
      
      {/* Validation */}
      {/* <div
        style={{
          padding: '10px',
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid #ccc',
          height: '20%',
        }}
      >
        <h4>Location Validation</h4>
        <p>
          Provided Location: <strong>{location || 'None provided'}</strong>
        </p>
        {!isValid && location && (
          <p style={{ color: 'red' }}>
            The location &quot;{location}&quot; is not a valid US state.
          </p>
        )}
        {isValid && selectedState && (
          <p style={{ color: 'green' }}>
            The location &quot;{selectedState}&quot; was found and is highlighted on the map.
          </p>
        )}
      </div> */}
    </div>
  );
};

export default LocationMap;
