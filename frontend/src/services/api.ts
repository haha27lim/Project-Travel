import axios, { AxiosError } from 'axios';
import { Trip } from '../types/trip';
import EventBus from '../common/EventBus';

const API_URL = '/api/trips';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            EventBus.dispatch("logout");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const tripApi = {
    // User-Specific Endpoints
    getCurrentUserTrips: () => instance.get<Trip[]>(`/user`), // Fetch current user's trips
    getTrips: () => instance.get<Trip[]>(``), // Fetch all trips for the current user
    getTripById: (id: number) => instance.get<Trip>(`/${id}`), // Fetch a specific trip by ID
    createTrip: (trip: Omit<Trip, 'id'>) => instance.post<Trip>(``, trip), // Create a new trip for the current user
    updateTrip: (id: number, trip: Partial<Trip>) => instance.put<Trip>(`/${id}`, trip), // Update a specific trip for the current user
    deleteTrip: (id: number) => instance.delete<void>(`/${id}`), // Delete a specific trip for the current user

    // Admin-Specific Endpoints
    getAllTrips: () => instance.get<Trip[]>(`/admin`), // Fetch all trips (admin access)
    getAdminTripById: (id: number) => instance.get<Trip>(`/admin/${id}`), // Fetch a specific trip by ID (admin access)
    createAdminTrip: (trip: Omit<Trip, 'id'>, username: string) =>
        instance.post<Trip>(`/admin?username=${username}`, trip), // Create a trip for a specific user (admin access)
    updateAdminTrip: (id: number, trip: Partial<Trip>) =>
        instance.put<Trip>(`/admin/${id}`, trip), // Update a specific trip (admin access)
    deleteAdminTrip: (id: number) => instance.delete<void>(`/admin/${id}`), // Delete a specific trip (admin access)
};
