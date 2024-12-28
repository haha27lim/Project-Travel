import React from 'react';
import { Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { Trip } from "../types/trip";
import { formatDateRange } from '../utils/dateUtils';
import '../styles/components/TripCard.css';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(trip)}
      className="trip-card"
    >
      <h3 className="trip-title">
        <MapPin className="icon icon-blue" />
        {trip.destination}
      </h3>
      <div className="trip-info">
        <Calendar className="icon" />
        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
      </div>
      <div className="trip-info">
        <Clock className="icon" />
        <span>{trip.activities?.length ?? 0} activities planned</span>
      </div>
      {trip.notes && (
        <div className="trip-notes">
          <FileText className="icon" />
          <p>{trip.notes}</p>
        </div>
      )}
    </div>
  );
};