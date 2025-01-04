import React from 'react';
import { Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { Trip } from "../types/trip";
import { formatDateRange } from '../utils/dateUtils';
import '../styles/components/TripCard.css';
import { TripActions } from './TripActions';
import { useNavigate } from 'react-router-dom';
import { setLastViewedTimestamp } from '../utils/tripUtil';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (tripId: number) => void;
  viewOnly?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect, onEdit, onDelete, viewOnly = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (trip.id) {
      setLastViewedTimestamp(trip.id);
    }
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="trip-card"
    >
      <div className="flex justify-between items-start">
        <h3 className="trip-title" >
          <MapPin className="icon icon-blue" />
          {trip.destination}
        </h3>
        {!viewOnly && (
          <TripActions
            onEdit={() => onEdit?.(trip)}
            onDelete={() => onDelete?.(trip?.id || 0)}
          />
        )}
      </div>
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
          <FileText className="w-5 h-5" />
          <p>{trip.notes}</p>
        </div>
      )}
    </div>
  );
};