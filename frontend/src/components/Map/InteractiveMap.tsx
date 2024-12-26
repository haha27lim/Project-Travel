import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { MAPS_CONFIG } from '../../config/maps';
import { MapContainer } from '../Map/MapContainer';
import { MapMarker } from '../Map/MapMarker';
import { LatLngLiteral } from '../../types/maps';
import '../../styles/map/InteractiveMap.css';

interface InteractiveMapProps {
  onLocationSelect?: (location: { lng: number; lat: number; name: string }) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState<LatLngLiteral | null>(null);

  const handleMapClick = (location: LatLngLiteral) => {
    setSelectedLocation(location);
    onLocationSelect?.({
      ...location,
      name: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
    });
  };

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={MAPS_CONFIG.apiKey}>
        <MapContainer onMapClick={handleMapClick}>
          {selectedLocation && <MapMarker position={selectedLocation} />}
        </MapContainer>
      </LoadScript>
    </div>
  );
};