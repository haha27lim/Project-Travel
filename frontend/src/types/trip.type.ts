export interface Activity {
  id?: number;
  name: string;
  date: string;
  time: string;
  location: string;
  notes: string;
}

export interface Place {
  id?: number;
  name: string;
  notes: string;
  imageUrl: string;
}

export interface Trip {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
  user: {
    id: number;
    username: string;
  };
  activities?: Array<{
    id: number;
    name: string;
    date: string;
    description?: string;
  }>;
  places?: Array<{
    id: number;
    name: string;
    address?: string;
    notes?: string;
  }>;
} 