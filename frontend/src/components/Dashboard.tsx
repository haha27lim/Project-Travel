import { useState } from "react";
import { Trip } from "../types/trip";
import { TripList } from "./TripList.tsx";
import { TripForm } from "./TripForm.tsx";
import { TripDetails } from "./TripDetails.tsx";
import { tripApi } from '../services/api';
import '../styles/components/Dashboard.css';

export const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddTrip = async (newTrip: Omit<Trip, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const createdTrip = await tripApi.createTrip(newTrip);
      setTrips(prevTrips => [...prevTrips, createdTrip]);
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };


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

              />
            )}
          </div>
          <div className="form-section">
            <TripForm onSubmit={handleAddTrip}/>
          </div>
        </div>
      </main>
      {(
        <TripDetails

        />
      )}   
    </div>
  );
};