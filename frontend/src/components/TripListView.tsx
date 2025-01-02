import React, { useState } from 'react';
import { Trip } from "../types/trip";
import { TripCard } from './TripCard';
import '../styles/components/TripList.css';
import { TripDetails } from './TripDetails';

interface TripListViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const TripListView: React.FC<TripListViewProps> = ({ trips, onSelectTrip }) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    onSelectTrip(trip);
  };

  return (
    <>
        <div className="trip-grid">
        {trips.map((trip) => (
            <TripCard 
            key={trip.id} 
            trip={trip} 
            onSelect={onSelectTrip}
            viewOnly={true}
            />
        ))}
        </div>
    </>
  );
};