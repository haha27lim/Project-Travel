import React from 'react';
import { Pencil, Trash2 } from "lucide-react";

interface TripActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}


export const TripActions: React.FC<TripActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        title="Edit trip"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to delete this trip?')) {
            onDelete();
          }
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
        title="Delete trip"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

