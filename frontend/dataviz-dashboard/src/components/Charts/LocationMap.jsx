import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import usStatesData from '../../data/us-states.json'; // Adjust the path based on your project structure

// Default center coordinate (geographic center of the contiguous US)
const defaultCenter = [39.8283, -98.5795];

const LocationMap = ({ location }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [isValid, setIsValid] = useState(true);
//   For validation
  //location = "California"

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

  // Style function to highlight the matching state.
  const stateStyle = (feature) => {
    const featureName = (feature.properties.name || feature.properties.NAME || '').toLowerCase();
    const highlighted = selectedState && (featureName === selectedState.toLowerCase());
    return {
      fillColor: highlighted ? '#ff0000' : '#ffffff',
      weight: highlighted ? 3 : 1,
      opacity: 1,
      color: highlighted ? '#000000' : 'gray',
      fillOpacity: highlighted ? 0.7 : 0.1,
    };
  };

  // Optional: bind a popup to each state for additional validation.
  const onEachState = (feature, layer) => {
    const featureName = feature.properties.name || feature.properties.NAME;
    layer.bindPopup(featureName);
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
