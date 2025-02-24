import React, { useState } from 'react';
import aiService, { ItineraryRequest } from '../../services/ai.service';
import '../../styles/components/ItineraryGenerator.css';
import { Mail, Share2, Download, Smartphone, MessageCircle } from 'lucide-react';

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
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

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

    const generatePDF = () => {
        if (!itinerary) return;

        const itineraryElement = document.querySelector('.itinerary-content');
        if (!itineraryElement) return;

        
        const formattedContent = itinerary.split('\n')
            .map(line => {
                if (line.trim().length === 0) return '';
                if (line.toLowerCase().includes('day')) {
                    return `<div style="color: #2563eb; font-weight: bold; font-size: 14px; margin-top: 12px; border-bottom: 1px solid #e5e7eb;">${line.trim()}</div>`;
                }
                if (line.includes(':')) {
                    const [label, content] = line.split(':');
                    return `<div style="margin: 4px 0; font-size: 12px;"><strong style="color: #4B5563;">${label.trim()}:</strong> ${content.trim()}</div>`;
                }
                return `<div style="margin: 3px 0; font-size: 12px;">${line.trim()}</div>`;
            })
            .filter(line => line.length > 0)
            .join('');

        
        const pdfContent = document.createElement('div');
        pdfContent.style.width = '100%';
        pdfContent.style.padding = '0';
        pdfContent.style.margin = '0';
        pdfContent.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 10px; margin: 0; line-height: 1.2;">
                <div style="color: #2563eb; font-weight: bold; font-size: 16px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e5e7eb;">
                    Travel Itinerary for ${destination}
                </div>
                ${formattedContent}
                <div style="color: #6b7280; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-style: italic; font-size: 10px;">
                    Generated by TravelBloom AI Travel Planner
                </div>
            </div>
        `;

        
        const opt = {
            margin: [0.2, 0.3, 0.2, 0.3],
            filename: `${destination}_itinerary.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: 0,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true,
                putOnlyUsedFonts: true
            }
        };

        // Generate PDF
        window.html2pdf()
            .from(pdfContent)
            .set(opt)
            .save()
            .catch((error: Error) => {
                console.error('PDF generation error:', error);
            });
    };

    const shareViaWhatsApp = () => {
        
        const formattedText = itinerary?.split('\n')
            .map(line => {
                if (line.toLowerCase().includes('day')) {
                    return `\n*${line.trim()}*`;  // Bold for day headers
                }
                if (line.includes(':')) {
                    const [label, content] = line.split(':');
                    return `_${label.trim()}:_ ${content.trim()}`; // Italics for labels
                }
                return line.trim();
            })
            .filter(line => line.length > 0)
            .join('\n');

        const text = `*Travel Itinerary for ${destination}*\n\n${formattedText}\n\n_Generated by TravelBloom AI Travel Planner_`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    };

    const shareViaBluetooth = async () => {
        try {
            if (!navigator.bluetooth) {
                alert('Bluetooth is not supported in your browser');
                return;
            }

            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['generic_access']
            });

            alert('Device selected: ' + device.name);
        } catch (error) {
            console.error('Bluetooth error:', error);
            alert('Failed to share via Bluetooth. Please make sure Bluetooth is enabled.');
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
                        <div className="share-options">
                            <button
                                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                                className="share-button"
                                disabled={loading}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </button>
                            {isShareMenuOpen && (
                                <div className="share-menu">
                                    <button onClick={() => setIsSharing(true)} className="share-option">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email
                                    </button>
                                    <button onClick={shareViaWhatsApp} className="share-option">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        WhatsApp
                                    </button>
                                    <button onClick={generatePDF} className="share-option">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </button>
                                    <button onClick={shareViaBluetooth} className="share-option">
                                        <Smartphone className="w-4 h-4 mr-2" />
                                        Bluetooth
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="itinerary-content">
                        {itinerary.split('\n').map((line, index) => {
                            const isNewDay = line.toLowerCase().includes("day");
                            return (
                                <React.Fragment key={index}>
                                    {isNewDay && index > 0 && <hr />}
                                    <p 
                                        className={`itinerary-line ${line.includes(':') ? 'itinerary-heading' : ''}`}
                                        data-day={isNewDay}
                                    >
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