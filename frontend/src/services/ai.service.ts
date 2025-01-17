import axios from 'axios';
import EventBus from '../common/EventBus';
import authHeader from './auth-header';


const API_URL = '/api';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


instance.interceptors.request.use(
    (config) => {
        const headers = authHeader();
        if (headers.Authorization) {
            config.headers.Authorization = headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && error.config.requiresAuth) {
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

interface ChatMessage {
    message: string;
    isAuthenticated: boolean;
    userId?: string;
}

const generateItinerary = async (request: ItineraryRequest): Promise<string> => {
    const params = new URLSearchParams({
        destination: request.destination,
        days: request.days.toString(),
        ...(request.preferences && { preferences: request.preferences }),
        ...(request.budget && { budget: request.budget })
    });

    const response = await instance.post(`/ai/generate-itinerary?${params.toString()}`, null);
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


const handleGuestMessage = (message: string): string => {
    message = message.toLowerCase();
    

    if (message.includes("benefit") || (message.includes("what") && message.includes("get")) || 
        (message.includes("why") && message.includes("sign up"))) {
        return "Here are the great benefits of signing up with TravelBloom:\n" +
               "✨ Personalized AI-powered travel recommendations\n" +
               "📅 Create and save custom travel itineraries\n" +
               "💰 Smart budget planning and tracking\n" +
               "🗺️ Save and organize your favorite places\n" +
               "🤖 Access to our AI travel assistant for personalized help\n" +
               "📱 Sync your plans across all devices\n\n" +
               "Sign up now to start planning your perfect trip!";
    }


    if (message.includes("how") && message.includes("work")) {
        return "TravelBloom makes travel planning easy and fun! Here's how it works:\n" +
               "1. Create your free account\n" +
               "2. Tell us your travel preferences and style\n" +
               "3. Get AI-powered personalized trip recommendations\n" +
               "4. Use our smart tools to plan your itinerary\n" +
               "5. Manage your budget and bookings in one place\n\n" +
               "Sign up to experience the future of travel planning!";
    }


    if (message.includes("sign up") || message.includes("register") || 
        (message.includes("how") && message.includes("join"))) {
        return "Signing up is quick and easy!\n" +
               "1. Click the 'Register' button in the top right corner\n" +
               "2. Enter your email and create a password\n" +
               "3. Verify your email\n" +
               "4. Set up your travel preferences\n\n" +
               "The whole process takes less than 2 minutes, and it's completely free!";
    }


    if (message.includes("feature") || message.includes("what can you do") || 
        message.includes("what do you offer")) {
        return "TravelBloom offers these amazing features:\n" +
               "✈️ AI-powered itinerary planning\n" +
               "💰 Smart budget management\n" +
               "🗺️ Personalized travel recommendations\n" +
               "📅 Trip scheduling and organization\n" +
               "📍 Place bookmarking and notes\n" +
               "🤖 24/7 AI travel assistant\n\n" +
               "Sign up to unlock all these features and more!";
    }


    if (message.includes("create") && (message.includes("itinerary") || message.includes("plan"))) {
        return "Creating an itinerary with TravelBloom is a breeze! Once you sign up, you can:\n" +
               "1. Choose your destination and dates\n" +
               "2. Set your preferences and budget\n" +
               "3. Get AI-generated custom itineraries\n" +
               "4. Customize every detail of your trip\n" +
               "5. Share and collaborate with travel companions\n\n" +
               "Ready to start planning? Sign up now!";
    }


    if (message.includes("cost") || message.includes("price") || message.includes("free")) {
        return "Great news! Creating an account on TravelBloom is completely FREE!\n" +
               "You'll get access to:\n" +
               "✓ Basic trip planning tools\n" +
               "✓ AI travel recommendations\n" +
               "✓ Budget management features\n" +
               "✓ Place bookmarking\n\n" +
               "Sign up now to start your travel planning journey!";
    }


    if (message.includes("help") || message.includes("assist") || message.includes("support")) {
        return "I'm your friendly TravelBloom assistant! I can help you with:\n" +
               "❓ Learning about our features\n" +
               "❓ Understanding how to use the platform\n" +
               "❓ Getting started with trip planning\n" +
               "❓ Finding the best travel options\n\n" +
               "For more personalized assistance, sign up for a free account!";
    }


    return "Welcome to TravelBloom! I can tell you about our features, how to sign up, or how our platform works. " +
           "What would you like to know? You can ask about:\n" +
           "• Benefits of signing up\n" +
           "• How TravelBloom works\n" +
           "• Our features\n" +
           "• Creating itineraries\n" +
           "• Getting started";
};

const aiService = {
    generateItinerary,
    shareItinerary,
    async processChatMessage(data: ChatMessage): Promise<string> {
        try {

            if (!data.isAuthenticated) {
                return handleGuestMessage(data.message);
            }


            const response = await instance.post('/ai/chat', data);
            return response.data.response;
        } catch (error) {
            console.error('Error processing chat message:', error);
            if (!data.isAuthenticated) {
                return handleGuestMessage(data.message);
            }
            throw error;
        }
    }
};

export type { ChatMessage };
export default aiService; 