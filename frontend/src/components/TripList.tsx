import React, { useState } from 'react';
import { Trip } from "../types/trip";
import { TripCard } from './TripCard';
import '../styles/components/TripList.css';
import { TripForm } from './TripForm';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onUpdateTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: number) => void;
}

export const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip, onUpdateTrip, onDeleteTrip }) => {
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const handleEditSubmit = (updatedTrip: Trip) => {
    onUpdateTrip(updatedTrip);
    setEditingTrip(null);
  };

  return (
    <>
      <div className="trip-grid">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onSelect={onSelectTrip} onEdit={setEditingTrip} onDelete={onDeleteTrip}/>
        ))}
      </div>

      {editingTrip && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="text-xl font-semibold mb-4"> Edit Trip</h2>
            <TripForm initialTrip={editingTrip} onSubmit={handleEditSubmit} onCancel={() => setEditingTrip(null)} />
          </div>
        </div>
      )}
    </>
  );
};