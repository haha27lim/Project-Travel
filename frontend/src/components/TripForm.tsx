import React, { useState } from "react";
import { Trip } from "../types/trip";
import { MapPin, PlusCircle } from "lucide-react";
import { InteractiveMap } from './Map/InteractiveMap';
import '../styles/components/TripForm.css';


interface TripFormProps {
    onSubmit: (trip: Omit<Trip, 'id'>) => void;
}


export const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {

    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            destination,
            startDate,
            endDate,
            activities: [],
            notes,
          });
        setDestination('');
        setStartDate('');
        setEndDate('');
        setNotes('');
  
      };


    return (
        <form onSubmit={handleSubmit} className="trip-form">
        <h2 className="form-title">Plan New Trip</h2>
        
        <div className="form-section">
          <label className="input-label">Select Location</label>
          <InteractiveMap />
        </div>
  
        <div className="form-fields">
          <div className="input-group">
            <label className="input-label">Destination</label>
            <div className="input-with-icon">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
              className="input-field"
              rows={3}
            />
          </div>
  
          <button type="submit" className="submit-button">
            <PlusCircle className="button-icon" />
            Add Trip
          </button>
        </div>
      </form>
    );
};