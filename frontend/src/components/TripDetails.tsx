import React from 'react';
import { Clock, MapPin, X } from 'lucide-react';
import { Trip } from "../types/trip";
import '../styles/components/TripDetails.css';

interface TripDetailsProps {
  trip: Trip;
  onClose: () => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, onClose }) => {
  return (
    <div className="trip-details">
      <div className="trip-details-content">
        <h2 className="trip-title">{trip.destination}
          <button
            className="modal-close"
            onClick={onClose}
          >
            <X className="icon" />
          </button>
        </h2>
        <p className="trip-info">
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        {trip.notes && (
          <div className="trip-notes">
            <h3>Notes</h3>
            <p>{trip.notes}</p>
          </div>
        )}
        {trip.activities && trip.activities.length > 0 && (
          <div className="trip-activities">
            <h3>Activities</h3>
            {trip.activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <h4>{activity.name}</h4>
                <div className="activity-details">
                  <p><Clock className="icon" /> {activity.date} at {activity.time}</p>
                  <p><MapPin className="icon" /> {activity.location}</p>
                  {activity.notes && <p>{activity.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};