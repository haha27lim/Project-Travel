import React from 'react';
import { Marker, useGoogleMap } from '@react-google-maps/api';
import { LatLngLiteral } from '../../types/maps';

interface MapMarkerProps {
  position: LatLngLiteral;
  onPlaceSelect?: (location: { position: LatLngLiteral; address: string }) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ position, onPlaceSelect }) => {
  const map = useGoogleMap();
  const [isAdvancedMarkerAvailable, setIsAdvancedMarkerAvailable] = React.useState(false);
  const [placeName, setPlaceName] = React.useState<string>('');
  const markerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (window.google?.maps?.Geocoder && position) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const address = results[0].formatted_address;
          setPlaceName(address);
          onPlaceSelect?.({ position, address });
        }
      });
    }
  }, [position, onPlaceSelect]);

  React.useEffect(() => {
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
      setIsAdvancedMarkerAvailable(true);
      if (!markerRef.current && map) {
        try {
          const container = document.createElement('div');
          container.className = 'marker-container';
          
          const pin = document.createElement('div');
          pin.className = 'marker-pin';
          
          const label = document.createElement('div');
          label.className = 'marker-label';
          label.textContent = placeName || 'Loading...';
          
          container.appendChild(pin);
          container.appendChild(label);

          container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
          `;

          pin.style.cssText = `
            width: 24px;
            height: 24px;
            background-color: #4285F4;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          `;

          label.style.cssText = `
            margin-top: 4px;
            padding: 4px 8px;
            background-color: white;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            font-size: 12px;
            white-space: nowrap;
          `;

          markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            content: container
          });
        } catch (error) {
          console.warn('Failed to create AdvancedMarkerElement:', error);
          setIsAdvancedMarkerAvailable(false);
        }
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, position, placeName]);

  React.useEffect(() => {
    if (markerRef.current && isAdvancedMarkerAvailable) {
      markerRef.current.position = position;
      if (markerRef.current.content) {
        const label = markerRef.current.content.querySelector('.marker-label');
        if (label) {
          label.textContent = placeName || 'Loading...';
        }
      }
    }
  }, [position, isAdvancedMarkerAvailable, placeName]);


  if (!isAdvancedMarkerAvailable) {
    return (
      <Marker
        position={position}
        title={placeName}
        label={{
          text: placeName,
          color: '#000000',
          fontSize: '12px',
          className: 'marker-label'
        }}
      />
    );
  }

  return null;
};