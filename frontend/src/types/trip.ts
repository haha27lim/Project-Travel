export interface Trip {
    id?: number;
    destination: string;
    startDate: string;
    endDate: string;
    activities?: Activity[];
    places?: Place[];
    notes: string;
}

export interface Activity {
    id?: number;
    name: string;
    date: string;
    time: string;
    location?: string;
    notes: string;
}

export interface Place {
    id?: number;
    name: string;
    notes: string;
    imageUrl?: string;
}