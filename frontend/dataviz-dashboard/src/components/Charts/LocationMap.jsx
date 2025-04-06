import React from 'react';
import usa_map from '../../images/US_MAP.jpg';// Tell webpack this JS file uses this image

const LocationMap =  ({  }) => {
    return (
        <img
        src={usa_map}
        alt="Map of USA"
        style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // or 'cover' depending on your preference
            display: 'block'
          }}
      />
      );
}

export default LocationMap