import React, { useState } from 'react';
import { Place } from '../types/trip';
import { Check, FileText, Trash2 } from 'lucide-react';

interface PlaceFormProps {
    place?: Place;
    onSubmit: (place: Place) => void;
    onCancel: () => void;
}

export const PlaceForm: React.FC<PlaceFormProps> = ({ place, onSubmit, onCancel }) => {
    const [name, setName] = useState(place?.name || '');
    const [notes, setNotes] = useState(place?.notes || '');
    const [imageUrl, setImageUrl] = useState(place?.imageUrl || '');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name, notes, imageUrl });
        setName('');
        setNotes('');
        setImageUrl('');
        setIsExpanded(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isExpanded) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="place-item">
            <div className="place-basic-info">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Place name"
                    required
                />
                <div className="place-actions">
                    <button
                        type="submit"
                        className="submit-button"
                        title="Add place"
                    >
                        <Check size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="expand-button"
                        title={isExpanded ? 'Hide details' : 'Add note'}
                    >
                        <FileText size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="remove-button"
                        title="Cancel"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="place-details">
                    <textarea
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <input
                        type="url"
                        placeholder="Image URL (optional)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
            )}
        </form>
    );
};