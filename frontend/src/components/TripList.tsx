import React, { useState } from 'react';
import { Trip } from "../types/trip";
import { TripCard } from './TripCard';
import { TripDetails } from './TripDetails';
import '../styles/components/TripList.css';
import { TripForm } from './TripForm';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onUpdateTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: number) => void;
}

export const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip, onUpdateTrip, onDeleteTrip }) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    onSelectTrip(trip);
  };

  const handleEditSubmit = (updatedTrip: Trip) => {
    onUpdateTrip(updatedTrip);
    setEditingTrip(null);
  };

  return (
    <>
      <div className="trip-grid">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onSelect={handleTripClick} onEdit={setEditingTrip} onDelete={onDeleteTrip}/>
        ))}
      </div>

      {selectedTrip && (
        <TripDetails 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
          onEdit={() => {
            setEditingTrip(selectedTrip);
            setSelectedTrip(null);
          }}
          onDelete={() => {
            if (window.confirm('Are you sure you want to delete this trip?')) {
              onDeleteTrip(selectedTrip?.id || 0);
              setSelectedTrip(null);
            }
          }}
        />
      )}

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