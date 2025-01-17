import React, { useState } from "react";
import { Activity, Trip, Place } from "../types/trip";
import { FileText, MapPin, PlusCircle, Trash2, X } from "lucide-react";
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
  const [activities, setActivities] = useState<Activity[]>(initialTrip?.activities || []);
  const [places, setPlaces] = useState<Place[]>(initialTrip?.places || []);
  const [expandedPlaces, setExpandedPlaces] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialTrip?.id,
      destination,
      startDate,
      endDate,
      activities,
      places,
      notes
    });

    if (!initialTrip) {
      setDestination('');
      setStartDate('');
      setEndDate('');
      setNotes('');
      setActivities([]);
      setPlaces([]);
    }
  };

  const handleLocationSelect = (loc: { name: string }) => {
    setDestination(loc.name);

  };

  const addActivity = () => {
    setActivities([...activities, {
      name: '',
      date: '',
      time: '',
      location: '',
      notes: ''
    }]);
  };

  const addPlace = () => {
    setPlaces([...places, {
      name: '',
      notes: '',
      imageUrl: ''
    }]);
  };

  const updateActivity = (index: number, field: keyof Activity, value: string) => {
    const updatedActivities = activities.map((activity, i) => {
      if (i === index) {
        return { ...activity, [field]: value };
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  const updatePlace = (index: number, field: keyof Place, value: string) => {
    const newPlaces = [...places];
    newPlaces[index] = { ...newPlaces[index], [field]: value };
    setPlaces(newPlaces);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const removePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  const togglePlaceExpansion = (index: number) => {
    setExpandedPlaces(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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

        <div className="input-group">
          <label className="input-label">Places to Visit</label>
          <button type="button" onClick={addPlace} className="add-button">
            <PlusCircle size={20} /> Add a place
          </button>
        </div>
        {places.map((place, index) => (
          <div key={index} className="place-item">
            <div className="place-basic-info">
              <input
                type="text"
                placeholder="Place name"
                value={place.name}
                onChange={(e) => updatePlace(index, 'name', e.target.value)}
                required
              />
              <div className="place-actions">
                <button
                  type="button"
                  onClick={() => togglePlaceExpansion(index)}
                  className="expand-button"
                  title={expandedPlaces.includes(index) ? 'Hide details' : 'Add note'}
                >
                   <FileText size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => removePlace(index)}
                  className="remove-button"
                  title="Remove place"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {expandedPlaces.includes(index) && (
              <div className="place-details">
                <textarea
                  placeholder="Notes"
                  value={place.notes}
                  onChange={(e) => updatePlace(index, 'notes', e.target.value)}
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={place.imageUrl}
                  onChange={(e) => updatePlace(index, 'imageUrl', e.target.value)}
                />
              </div>
            )}
          </div>
        ))}

        <div className="activities-section">
          <div className="activities-header">
            <h3 className="section-subtitle">Itinerary</h3>
            <button
              type="button"
              onClick={addActivity}
              className="add-activity-button"
            >
              <PlusCircle className="w-4 h-4" />
              Add Activity
            </button>
          </div>

          {activities.map((activity, index) => (
            <div key={index} className="activity-form">
              <div className="activity-header">
                <h4>Activity {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="remove-activity-button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="activity-fields">
                <div className="input-group">
                  <label className="input-label">Name</label>
                  <input
                    type="text"
                    value={activity.name}
                    onChange={(e) => updateActivity(index, 'name', e.target.value)}
                    className="input-field"
                    placeholder="Activity name"
                    required
                  />
                </div>

                <div className="activity-datetime">
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      value={activity.date}
                      onChange={(e) => updateActivity(index, 'date', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Time</label>
                    <input
                      type="time"
                      value={activity.time}
                      onChange={(e) => updateActivity(index, 'time', e.target.value)}
                      className="input-field"
                      required                      
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    value={activity.location}
                    onChange={(e) => updateActivity(index, 'location', e.target.value)}
                    className="input-field"
                    placeholder="Activity location"                    
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Notes</label>
                  <textarea
                    value={activity.notes}
                    onChange={(e) => updateActivity(index, 'notes', e.target.value)}
                    className="notes-field"
                    rows={2}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>
          ))}
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