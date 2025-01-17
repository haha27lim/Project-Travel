package com.example.springjwt.service;

import org.springframework.stereotype.Service;

@Service
public class AIChatService {


    public String processMessage(String message, boolean isAuthenticated, String userId) {

        if (!isAuthenticated) {
            return handleGuestMessage(message.toLowerCase());
        } else {
            return handleAuthenticatedMessage(message.toLowerCase(), userId);
        }
    }

    private String handleGuestMessage(String message) {

        if (message.contains("how") && message.contains("work")) {
            return "TravelBloom helps you plan your perfect trip! You can create itineraries, manage your budget, and get AI-powered travel recommendations. Sign up to access all features!";
        }
        if (message.contains("sign up") || message.contains("register")) {
            return "You can sign up by clicking the 'Register' button in the top right corner. Registration is free and gives you access to personalized travel planning features!";
        }
        if (message.contains("features") || message.contains("what can you do")) {
            return "As a guest, you can explore our basic features. Sign up to access: \n" +
                   "✈️ AI-powered itinerary planning\n" +
                   "💰 Budget management\n" +
                   "🗺️ Personalized travel recommendations\n" +
                   "📅 Trip scheduling and organization";
        }
        if (message.contains("create") && message.contains("itinerary")) {
            return "To create an itinerary, you'll need to sign up first. Once registered, you can use our AI-powered itinerary planner to create custom travel plans based on your preferences!";
        }


        return "I'm here to help you explore TravelBloom! Feel free to ask about our features or how to get started. Sign up to access personalized travel planning assistance!";
    }

    private String handleAuthenticatedMessage(String message, String userId) {

        if (message.contains("create") && message.contains("itinerary")) {
            return "To create a new itinerary, go to the 'New Trip' section and provide your destination, dates, and preferences. Our AI will help you plan the perfect trip!";
        }
        if (message.contains("view") && message.contains("itinerary")) {
            return "You can view all your itineraries in the 'My Trips' section. Click on any trip to see its details and make modifications.";
        }
        if (message.contains("budget") || message.contains("cost")) {
            return "You can manage your trip budget in the trip details page. Set your total budget, track expenses, and get suggestions for activities within your price range.";
        }
        if (message.contains("recommend") || message.contains("suggestion")) {
            return "Based on your preferences and past trips, I recommend exploring our curated destinations. Check the 'Recommendations' section for personalized travel suggestions!";
        }
        if (message.contains("help")) {
            return "I can help you with:\n" +
                   "✈️ Creating new itineraries\n" +
                   "💰 Managing your travel budget\n" +
                   "🗺️ Finding destinations\n" +
                   "📅 Organizing your trips\n" +
                   "What would you like assistance with?";
        }


        return "I'm your personal travel assistant! I can help you plan trips, manage itineraries, and find great destinations. What would you like to know?";
    }
} 