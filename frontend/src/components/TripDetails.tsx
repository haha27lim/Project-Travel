import React from 'react';
import { Clock, FileText, MapPin, Pencil, Trash2, X } from 'lucide-react';
import { Trip } from "../types/trip";
import '../styles/components/TripDetails.css';

interface TripDetailsProps {
  trip: Trip;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, onClose, onEdit, onDelete }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="trip-title">
            <MapPin className="icon icon-blue" />
            {trip.destination}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit trip"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete trip"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="trip-info">
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        {trip.notes && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes
            </h3>
            <p className="text-gray-600 whitespace-pre-line">{trip.notes}</p>
          </div>
        )}
        {trip.activities && trip.activities.length > 0 && (
          <div className="trip-activities">
            <h3>Itinerary</h3>
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