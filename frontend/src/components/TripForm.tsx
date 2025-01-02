import React, { useState } from "react";
import { Trip } from "../types/trip";
import { MapPin, PlusCircle, X } from "lucide-react";
import { InteractiveMap } from './Map/InteractiveMap';
import '../styles/components/TripForm.css';


interface TripFormProps {
  initialTrip?: Trip;
  onSubmit: (trip: Trip) => void;
  onCancel?: () => void;
}


export const TripForm: React.FC<TripFormProps> = ({ initialTrip, onSubmit, onCancel }) => {

  const [destination, setDestination] = useState(initialTrip?.destination || '');
  const [startDate, setStartDate] = useState(initialTrip?.startDate || '');
  const [endDate, setEndDate] = useState(initialTrip?.endDate || '');
  const [notes, setNotes] = useState(initialTrip?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialTrip?.id,
      destination,
      startDate,
      endDate,
      activities: initialTrip?.activities || [],
      notes
    });

    if (!initialTrip)
    setDestination('');
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  const handleLocationSelect = (loc: { name: string }) => {
    setDestination(loc.name);

  };

  return (
    <form onSubmit={handleSubmit} className="trip-form relative"  >
      <h2 className="form-title">{initialTrip ? 'Update Trip' : 'Plan New Trip'}</h2>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="form-section">
        <label className="input-label">Select Location</label>
        <InteractiveMap onLocationSelect={handleLocationSelect} />
      </div>

      <div className="form-fields">
        <div className="input-group">
          <label className="input-label">Destination</label>
          <div className="input-with-icon">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="input-field"
              required
            />
            <MapPin className="field-icon" />
          </div>
        </div>

        <div className="date-inputs">
          <div className="input-group">
            <label className="input-label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="notes-field"
            rows={3}
            placeholder="Write or paste anything here"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="submit-button">
            <PlusCircle className="button-icon" />
            {initialTrip ? 'Update Trip' : 'Add Trip'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};