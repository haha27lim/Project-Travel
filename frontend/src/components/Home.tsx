import { Map, Calendar, List, Users } from "lucide-react";
import '../styles/components/Home.component.css';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trip } from "../types/trip";
import { TripListView } from "./TripListView";
import { tripApi } from "../services/api";
import { getLastViewedTimestamp } from "../utils/tripUtil";


const Home: React.FC = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleStartPlanning = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  useEffect(() => {
    if (currentUser) {
      const fetchTrips = async () => {
        try {
          const response = await tripApi.getCurrentUserTrips();
          const sortedTrips = response.data
          .sort((a, b) => {
            const timestampA = getLastViewedTimestamp(a.id!);
            const timestampB = getLastViewedTimestamp(b.id!);
            return timestampB - timestampA;
          })
          .slice(0, 3);
          setTrips(sortedTrips);
        } catch (error) {
          console.error('Error fetching trips:', error);
        }
      };
      fetchTrips();
    }
  }, [currentUser]);

  return (
    <div className="landing-page">

      <section className="hero-section">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"
            alt="Travel Background"
            className="hero-image"
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Plan Your Dream Journey</h1>
          <p className="hero-description">
            Create detailed travel itineraries, organise activities, and make your travel dreams come true with our intuitive planning tools.
          </p>
          <button
            onClick={handleStartPlanning}
            className="cta-button"
          >
            Explore Now
          </button>
        </div>
      </section>

      {currentUser && (
        <div className="recent-section">
          <h2 className="recent-title">Recently viewed</h2>
          {trips.length === 0 ? (
            <div className="empty-state">
              No trips planned yet. Start by adding a new trip!
            </div>
          ) : (
            <TripListView 
              trips={trips}
              onSelectTrip={setSelectedTrip}
            />
          )}
        </div>
      )}

      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose Our Travel Planner?</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <Map className="feature-icon" />
              </div>
              <h3 className="feature-title">Interactive Maps</h3>
              <p className="feature-description">
                Visualise your journey with interactive maps and location planning.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <Calendar className="feature-icon" />
              </div>
              <h3 className="feature-title">Smart Scheduling</h3>
              <p className="feature-description">
                Organise your activities with our intuitive calendar system.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <List className="feature-icon" />
              </div>
              <h3 className="feature-title">Custom Itineraries</h3>
              <p className="feature-description">
                Create detailed itineraries tailored to your preferences.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <Users className="feature-icon" />
              </div>
              <h3 className="feature-title">Group Planning</h3>
              <p className="feature-description">
                Collaborate with friends and family on trip planning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
