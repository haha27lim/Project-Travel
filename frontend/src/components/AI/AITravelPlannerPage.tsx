import React from 'react';
import { Sparkles, Compass, MapPin } from 'lucide-react';
import ItineraryGenerator from './ItineraryGenerator';
import '../../styles/components/AITravelPlannerPage.css';

const AITravelPlannerPage: React.FC = () => {
    return (
        <div className="ai-planner-page">
            <div className="ai-planner-container">
                <div className="ai-planner-header">
                    <div className="title-wrapper">
                        <Sparkles className="title-icon" />
                        <h1 className="page-title">
                            AI Smart Travel Planner
                        </h1>
                    </div>
                    <div className="features-list">
                        <div className="feature-item">
                            <Compass className="feature-icon" />
                            <span>Smart Destination Planning</span>
                        </div>
                        <div className="feature-item">
                            <MapPin className="feature-icon" />
                            <span>Local Insights</span>
                        </div>
                    </div>
                    <p className="page-description">
                        Let our AI assistant help you create the perfect travel itinerary tailored to your preferences.
                        Get personalised recommendations for activities, restaurants, and must-see attractions.
                    </p>
                </div>
                <div className="ai-planner-content">
                    <ItineraryGenerator />
                </div>
            </div>
        </div>
    );
};

export default AITravelPlannerPage; 