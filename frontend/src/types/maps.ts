export interface LatLngLiteral {
    lat: number;
    lng: number;
}

export interface Location extends LatLngLiteral {
    name: string;
}