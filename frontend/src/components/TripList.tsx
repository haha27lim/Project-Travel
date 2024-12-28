import React, { useState } from 'react';
import { Trip } from "../types/trip";
import { TripCard } from './TripCard';
import { TripDetails } from './TripDetails';
import '../styles/components/TripList.css';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip }) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    onSelectTrip(trip);
  };

  return (
    <>
      <div className="trip-grid">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onSelect={handleTripClick} />
        ))}
      </div>

      {selectedTrip && (
        <TripDetails 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}
    </>
  );
};