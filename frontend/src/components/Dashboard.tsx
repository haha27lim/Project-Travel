import { useEffect, useState } from "react";
import { Trip } from "../types/trip";
import { TripList } from "./TripList.tsx";
import { TripForm } from "./TripForm.tsx";
import { tripApi } from '../services/api';
import '../styles/components/Dashboard.css';

export const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const response = await tripApi.getCurrentUserTrips();
        setTrips(response.data);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleAddTrip = async (newTrip: Omit<Trip, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tripApi.createTrip(newTrip);
      setTrips(prevTrips => [...prevTrips, response.data]);
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    try {
      const response = await tripApi.updateTrip(Number(updatedTrip.id), updatedTrip);
      setTrips(prevTrips => prevTrips.map(trip => trip.id === updatedTrip.id ? response.data : trip));
    } catch (err) {
      console.error('Error updating trip:', err);
      setError('Failed to update trip. Please try again.');
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    try {
      await tripApi.deleteTrip(Number(tripId));
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    } catch (err) {
      console.error('Error deleting trip:', err);
      setError('Failed to delete trip. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="trips-section">
            <h2 className="section-title">Your Trips</h2>
            {trips.length === 0 ? (
              <div className="empty-state">
                No trips planned yet. Start by adding a new trip!
              </div>
            ) : (
              <TripList 
                trips={trips}
                onSelectTrip={setSelectedTrip}
                onUpdateTrip={handleUpdateTrip}
                onDeleteTrip={handleDeleteTrip}
              />
            )}
          </div>
          <div className="form-section">
            <TripForm onSubmit={handleAddTrip} />
          </div>
        </div>
      </main>
    </div>
  );
};