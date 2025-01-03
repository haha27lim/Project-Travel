import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Place, Trip } from "../types/trip";
import { Clock, FileText, MapPin, Pencil, Trash2, ArrowLeft, PlusCircle } from 'lucide-react';
import { tripApi } from '../services/api';
import '../styles/components/TripDetails.css';
import { TripForm } from './TripForm';
import { PlaceForm } from './PlaceForm';

export const TripDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const response = await tripApi.getTripById(Number(id));
        setTrip(response.data);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!trip) return <div>Trip not found</div>;

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleEditSubmit = async (updatedTrip: Trip) => {
    try {
      await tripApi.updateTrip(Number(id), updatedTrip);
      setTrip(updatedTrip);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating trip:', err);
      setError('Failed to update trip');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripApi.deleteTrip(Number(id));
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting trip:', err);
      }
    }
  };

  const handleAddPlace = () => {
    setIsAddingPlace(true);
  };

  const handleEditPlace = (place: Place) => {
    setEditingPlace(place);
  };

  const handlePlaceSubmit = async (place: Place, isEditing: boolean) => {
    try {
      if (isEditing && editingPlace) {
        setTrip(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            places: prev.places?.map(p =>
              p.id === editingPlace.id ? { ...place, id: editingPlace.id } : p
            ) || []
          };
        });
        setEditingPlace(null);
      } else {
        setTrip(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            places: prev.places?.concat({ ...place, id: Date.now() }) || []
          };
        });
        setIsAddingPlace(false);
      }
    } catch (err) {
      console.error('Error saving place:', err);
    }
  };

  const handleDeletePlace = async (placeId: number) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        setTrip(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            places: prev.places?.filter(p => p.id !== placeId) || []
          };
        });
      } catch (err) {
        console.error('Error deleting place:', err);
      }
    }
  };

  if (isEditing && trip) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="text-xl font-semibold mb-4">Edit Trip</h2>
          <TripForm
            initialTrip={trip}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details-page">
      <div className="trip-details-container">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex justify-between items-start mb-4 mt-4">
          <h2 className="trip-title">
            <MapPin className="icon icon-blue" />
            Trip to {trip.destination}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit trip"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete trip"
            >
              <Trash2 className="w-5 h-5" />
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

        {trip.places && trip.places.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Places to Visit
              </h3>
              <button
                onClick={handleAddPlace}
                className="add-place-button"
                title="Add new place"
              >
                <PlusCircle className="w-4 h-4" />
                Add Place
              </button>
            </div>
            <div className="places-grid">
              {trip.places.map((place, index) => (
                <div key={index} className="place-card">
                  <div className="place-header">
                    <h4 className="place-name">{place.name}</h4>
                    <div className="place-actions">
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="place-action-btn edit"
                        title="Edit place"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id!)}
                        className="place-action-btn delete"
                        title="Delete place"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {place.notes && (
                    <p className="place-notes">{place.notes}</p>
                  )}
                  {place.imageUrl && (
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="place-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isAddingPlace && (
          <PlaceForm
            onSubmit={(place) => handlePlaceSubmit(place, false)}
            onCancel={() => setIsAddingPlace(false)}
          />
        )}

        {editingPlace && (
          <PlaceForm
            place={editingPlace}
            onSubmit={(place) => handlePlaceSubmit(place, true)}
            onCancel={() => setEditingPlace(null)}
          />
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