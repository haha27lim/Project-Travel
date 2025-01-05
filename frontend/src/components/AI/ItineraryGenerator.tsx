import React, { useState } from 'react';
import aiService, { ItineraryRequest } from '../../services/ai.service';
import '../../styles/components/ItineraryGenerator.css';

const ItineraryGenerator: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState(3);
    const [preferences, setPreferences] = useState('');
    const [budget, setBudget] = useState('moderate');
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatItinerary = (text: string): string => {
        // Remove markdown symbols and clean up the text
        return text
            .replace(/\*\*/g, '')  // Remove bold markers
            .replace(/\n\n/g, '\n') // Remove double line breaks
            .trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const request: ItineraryRequest = {
                destination,
                days,
                preferences: preferences || undefined,
                budget: budget || undefined
            };

            const result = await aiService.generateItinerary(request);
            setItinerary(formatItinerary(result));
        } catch (err) {
            setError('Failed to generate itinerary. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="itinerary-generator">
            <form onSubmit={handleSubmit} className="itinerary-form">
                <div className="form-group">
                    <label className="form-label">Destination</label>
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="form-input"
                        placeholder="Enter your destination"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Number of Days</label>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        min="1"
                        max="14"
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Travel Preferences (Optional)</label>
                    <textarea
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="form-textarea"
                        placeholder="E.g., outdoor activities, cultural experiences, food tours..."
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Budget</label>
                    <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="form-select"
                    >
                        <option value="budget">Budget</option>
                        <option value="moderate">Moderate</option>
                        <option value="luxury">Luxury</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="generate-button"
                >
                    {loading ? 'Generating...' : 'Generate Itinerary'}
                </button>
            </form>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {itinerary && (
                <div className="itinerary-result">
                    <h3 className="itinerary-title">Your Personalised Itinerary: {destination} ({days} days trip)</h3>
                    <div className="itinerary-content">
                        {itinerary.split('\n').map((line, index) => {
                            const isNewDay = line.toLowerCase().includes("day");

                            return (
                                <React.Fragment key={index}>
                                    {/* Insert <hr> if it's a new day */}
                                    {isNewDay && index > 0 && <hr />}
                                    <p className={`itinerary-line ${line.includes(':') ? 'itinerary-heading' : ''}`}>
                                        {line}
                                    </p>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ItineraryGenerator; 