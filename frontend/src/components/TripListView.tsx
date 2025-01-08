import React from 'react';
import { Trip } from "../types/trip";
import { TripCard } from './TripCard';
import '../styles/components/TripList.css';

interface TripListViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const TripListView: React.FC<TripListViewProps> = ({ trips, onSelectTrip }) => {

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