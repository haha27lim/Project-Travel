import React from 'react';
import { Marker } from '@react-google-maps/api';
import { LatLngLiteral } from '../../types/maps';

interface MapMarkerProps {
  position: LatLngLiteral;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ position }) => {
  return <Marker position={position} />;
};