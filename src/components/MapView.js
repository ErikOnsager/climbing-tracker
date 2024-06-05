import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { mapsConfig } from './mapsConfig';

const MapView = () => {
  const mapContainerStyle = {
    height: '100vh',
    width: '100vw'
  };

  const center = {
    lat: 40.73061, 
    lng: -73.935242 // Default longitude
  };

  const onLoad = marker => {
    console.log('Marker: ', marker);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={mapsConfig.apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          <Marker
            position={center}
            onLoad={onLoad}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;