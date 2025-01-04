import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAPS_CONFIG.apiKey,
  });

  const handleMapClick = (location: LatLngLiteral) => {
    setSelectedLocation(location);
  };

  const handlePlaceSelect = (location: { position: LatLngLiteral; address: string }) => {
    onLocationSelect?.({
      lng: location.position.lng,
      lat: location.position.lat,
      name: location.address
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="map-container">
      <MapContainer onMapClick={handleMapClick}>
        {selectedLocation && (
          <MapMarker 
            position={selectedLocation}
            onPlaceSelect={handlePlaceSelect}
          />
        )}
      </MapContainer>
    </div>
  );
};