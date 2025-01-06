import axios from 'axios';
import EventBus from '../common/EventBus';

const API_URL = '/api';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            EventBus.dispatch("logout");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface ItineraryRequest {
    destination: string;
    days: number;
    preferences?: string;
    budget?: string;
}

const generateItinerary = async (request: ItineraryRequest): Promise<string> => {
    const params = new URLSearchParams({
        destination: request.destination,
        days: request.days.toString(),
        ...(request.preferences && { preferences: request.preferences }),
        ...(request.budget && { budget: request.budget })
    });

    const response = await instance.post(`/ai/generate-itinerary?${params.toString()}`);
    return response.data;
};

const shareItinerary = async (destination: string, days: number, itinerary: string, recipientEmail: string): Promise<void> => {
    const response = await instance.post('/ai/share-itinerary', {
        destination,
        days,
        itinerary,
        recipientEmail
    });
    return response.data;
};

const aiService = {
    generateItinerary,
    shareItinerary
};

export default aiService; 