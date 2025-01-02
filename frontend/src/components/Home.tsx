import { Map, Calendar, List, Users } from "lucide-react";
import '../styles/components/Home.component.css';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trip } from "../types/trip";
import { TripList } from "./TripList";
import { TripListView } from "./TripListView";
import { tripApi } from "../services/api";

const Home: React.FC = () => {
  // const [content, setContent] = useState<string>("");

  // useEffect(() => {
  //   UserService.getPublicContent().then(
  //     (response) => {
  //       setContent(response.data);
  //     },
  //     (error) => {
  //       setContent(
  //         (error.response && error.response.data) ||
  //           error.message ||
  //           error.toString()
  //       );
  //     }
  //   );
  // }, []);

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
          setTrips(response.data.slice(0, 3));
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
            Create detailed travel itineraries, organize activities, and make your travel dreams come true with our intuitive planning tools.
          </p>
          <button
            onClick={handleStartPlanning}
            className="cta-button"
          >
            Start Planning Now
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
                Visualize your journey with interactive maps and location planning.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-container">
                <Calendar className="feature-icon" />
              </div>
              <h3 className="feature-title">Smart Scheduling</h3>
              <p className="feature-description">
                Organize your activities with our intuitive calendar system.
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
