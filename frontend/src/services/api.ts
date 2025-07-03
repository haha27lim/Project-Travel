import axios, { AxiosError } from 'axios';
import { Trip } from '../types/trip';
import EventBus from '../common/EventBus';

const API_URL = `${import.meta.env.VITE_API_URL}/api/trips`;

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            EventBus.dispatch("logout");
        }
        return Promise.reject(error);
    }
);

export const tripApi = {
    // User-Specific Endpoints
    getCurrentUserTrips: () => instance.get<Trip[]>(`/user`),
    getTrips: () => instance.get<Trip[]>(``),
    getTripById: (id: number) => instance.get<Trip>(`/${id}`),
    createTrip: (trip: Omit<Trip, 'id'>) => instance.post<Trip>(``, trip),
    updateTrip: (id: number, trip: Partial<Trip>) => instance.put<Trip>(`/${id}`, trip),
    deleteTrip: (id: number) => instance.delete<void>(`/${id}`),
    shareTrip: (id: number, recipientEmail: string) => 
        instance.post(`/${id}/share`, null, { params: { recipientEmail } }),

    // Admin-Specific Endpoints
    getAllTrips: () => instance.get<Trip[]>(`/admin`),
    getAdminTripById: (id: number) => instance.get<Trip>(`/admin/${id}`),
    createAdminTrip: (trip: Omit<Trip, 'id'>, username: string) =>
        instance.post<Trip>(`/admin?username=${username}`, trip),
    updateAdminTrip: (id: number, trip: Partial<Trip>) =>
        instance.put<Trip>(`/admin/${id}`, trip),
    deleteAdminTrip: (id: number) => instance.delete<void>(`/admin/${id}`),
};
