import { useEffect, useState } from "react";
import { Place } from "../types/trip.type";
import PlaceService from "../services/place.service";
import { MapPin, Plus, Trash2, Edit2 } from "lucide-react";
import "../styles/components/SavedPlaces.css";
import { AxiosError } from "axios";
import EventBus from "../common/EventBus";

const SavedPlaces: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlace, setNewPlace] = useState<Place>({
    name: "",
    notes: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await PlaceService.getSavedPlaces();
      setPlaces(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        EventBus.dispatch("logout");
      }
    }
  };

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await PlaceService.savePlace(newPlace);
      setPlaces([...places, response.data]);
      setShowAddForm(false);
      setNewPlace({ name: "", notes: "", imageUrl: "" });
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  const handleDeletePlace = async (id: number) => {
    try {
      await PlaceService.deletePlace(id);
      setPlaces(places.filter(place => place.id !== id));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="saved-places">
      <div className="places-header">
        <h1>Saved Places</h1>
        <button 
          className="add-place-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          Add New Place
        </button>
      </div>

      {showAddForm && (
        <div className="add-place-form">
          <form onSubmit={handleAddPlace}>
            <div className="form-group">
              <label htmlFor="name">Place Name</label>
              <input
                type="text"
                id="name"
                value={newPlace.name}
                onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={newPlace.notes}
                onChange={(e) => setNewPlace({ ...newPlace, notes: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                value={newPlace.imageUrl}
                onChange={(e) => setNewPlace({ ...newPlace, imageUrl: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Place</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="places-grid">
        {places.length > 0 ? (
          places.map((place) => (
            <div key={place.id} className="place-card">
              <div className="place-image">
                {place.imageUrl ? (
                  <img src={place.imageUrl} alt={place.name} />
                ) : (
                  <div className="placeholder-image">
                    <MapPin size={32} />
                  </div>
                )}
              </div>
              <div className="place-content">
                <h3>{place.name}</h3>
                {place.notes && <p>{place.notes}</p>}
              </div>
              <div className="place-actions">
                <button 
                  className="edit-btn"
                  onClick={() => {/* TODO: Implement edit functionality */}}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => place.id && handleDeletePlace(place.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <MapPin size={48} />
            <h2>No Places Saved Yet</h2>
            <p>Start saving your favorite destinations and places you want to visit!</p>
            <button 
              className="add-place-btn"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Place
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlaces; 