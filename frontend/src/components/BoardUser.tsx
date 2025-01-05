import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TripService from "../services/trip.service";
import EventBus from "../common/EventBus";
import { Calendar, MapPin, Clock, Plus, Activity, Sparkles } from "lucide-react";
import "../styles/components/BoardUser.css";
import { Trip } from "../types/trip.type";
import { AxiosError } from "axios";
import ItineraryGenerator from './AI/ItineraryGenerator';

export const BoardUser: React.FC = () => {
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalCountries: 0,
    totalPlaces: 0
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await TripService.getUserTrips();
      const trips = response.data;
      
      // Sort trips by start date and filter for upcoming trips
      const sortedTrips = trips
        .sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .filter((trip: Trip) => new Date(trip.startDate) >= new Date());

      setUpcomingTrips(sortedTrips);
      
      // Calculate stats
      const uniqueCountries = new Set(trips.map((trip: Trip) => trip.destination.split(',').pop()?.trim()));
      const totalPlaces = trips.reduce((acc: number, trip: Trip) => acc + (trip.places?.length || 0), 0);
      
      setStats({
        totalTrips: trips.length,
        totalCountries: uniqueCountries.size,
        totalPlaces: totalPlaces
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        EventBus.dispatch("logout");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>My Travel Dashboard</h1>
        <Link to="/dashboard" className="create-trip-btn">
          <Plus size={20} />
          Plan New Trip
        </Link>
      </div>

      <div className="dashboard-grid">
        {/* Upcoming Trips Section */}
        <div className="dashboard-card upcoming-trips">
          <div className="card-header">
            <Calendar className="card-icon" />
            <h2>Upcoming Trips</h2>
          </div>
          <div className="card-content">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map((trip) => (
                <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-item">
                  <MapPin size={16} />
                  <span>{trip.destination}</span>
                  <span className="trip-dates">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <p>No upcoming trips planned</p>
                <Link to="/trips/new" className="start-planning-btn">
                  Start Planning
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Travel Stats Section */}
        <div className="dashboard-card travel-stats">
          <div className="card-header">
            <Activity className="card-icon" />
            <h2>Travel Stats</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.totalTrips}</span>
              <span className="stat-label">Total Trips</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalCountries}</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalPlaces}</span>
              <span className="stat-label">Places Saved</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <Clock className="card-icon" />
            <h2>Recent Activity</h2>
          </div>
          <div className="card-content">
            {upcomingTrips.length > 0 ? (
              <div className="activity-list">
                {upcomingTrips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="activity-item">
                    <span className="activity-icon">🎯</span>
                    <span className="activity-text">
                      Trip to {trip.destination} planned for {new Date(trip.startDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <Link to="/dashboard" className="action-item">
              <Plus className="action-icon" />
              <span>New Trip</span>
            </Link>
            <Link to="/places/saved" className="action-item">
              <MapPin className="action-icon" />
              <span>Saved Places</span>
            </Link>
          </div>
        </div>

        {/* AI Travel Assistant Card */}
        <div className="dashboard-card ai-assistant">
          <div className="card-header">
            <Sparkles className="card-icon" />
            <h2>AI Travel Assistant</h2>
          </div>
          <div className="card-content">
            <ItineraryGenerator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardUser;
