import React, { useState } from 'react';
import aiService, { ItineraryRequest } from '../../services/ai.service';
import '../../styles/components/ItineraryGenerator.css';
import { Mail } from 'lucide-react';

const ItineraryGenerator: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState(3);
    const [preferences, setPreferences] = useState('');
    const [budget, setBudget] = useState('moderate');
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [shareError, setShareError] = useState<string | null>(null);
    const [shareSuccess, setShareSuccess] = useState(false);

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

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itinerary) return;

        try {
            setLoading(true);
            setShareError(null);
            await aiService.shareItinerary(destination, days, itinerary, recipientEmail);
            setShareSuccess(true);
            setIsSharing(false);
            setRecipientEmail('');
        } catch (err) {
            setShareError('Failed to share itinerary. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="itinerary-generator">
            <form onSubmit={handleSubmit} className="itinerary-form">
                <div className="form-group">
                    <label className="form-label" style={{ color: 'darkblue'}}>Destination</label>
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
                    <label className="form-label" style={{ color: 'darkblue'}}>Number of Days</label>
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
                    <label className="form-label" style={{ color: 'darkblue'}}>Travel Preferences (Optional)</label>
                    <textarea
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="form-textarea"
                        placeholder="E.g., outdoor activities, cultural experiences, food tours..."
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ color: 'darkblue'}}>Budget</label>
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
                    <div className="itinerary-header">
                        <h3 className="itinerary-title">Your Personalised Itinerary: {destination} ({days} days trip)</h3>
                        <button
                            onClick={() => setIsSharing(true)}
                            className="share-button"
                            disabled={loading}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Share via Email
                        </button>
                    </div>
                    <div className="itinerary-content">
                        {itinerary.split('\n').map((line, index) => {
                            const isNewDay = line.toLowerCase().includes("day");
                            return (
                                <React.Fragment key={index}>
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

            {isSharing && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Share Itinerary</h3>
                        <form onSubmit={handleShare} className="share-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Recipient's Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            {shareError && <div className="error-message">{shareError}</div>}
                            {shareSuccess && <div className="success-message">Itinerary shared successfully!</div>}
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsSharing(false)}
                                    className="cancel-button"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="share-submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Sharing...' : 'Share'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItineraryGenerator; 