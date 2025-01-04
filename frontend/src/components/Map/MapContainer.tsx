import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { MAPS_CONFIG } from '../../config/maps';
import { LatLngLiteral } from '../../types/maps';

interface MapContainerProps {
  children?: React.ReactNode;
  onMapClick?: (location: LatLngLiteral) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ children, onMapClick }) => {
  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && onMapClick) {
      onMapClick({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  return (
    <GoogleMap
      mapContainerClassName="map"
      center={MAPS_CONFIG.defaultCenter}
      zoom={MAPS_CONFIG.defaultZoom}
      options={MAPS_CONFIG.options}
      onClick={handleClick}
    >
      {children}
    </GoogleMap>
  );
};