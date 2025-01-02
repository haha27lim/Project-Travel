export interface Trip {
    id?: number;
    destination: string;
    startDate: string;
    endDate: string;
    activities?: Activity[];
    notes: string;
}

export interface Activity {
    id?: number;
    name: string;
    date: string;
    time: string;
    location: string;
    notes: string;
  }