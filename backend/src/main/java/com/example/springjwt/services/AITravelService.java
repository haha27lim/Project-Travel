package com.example.springjwt.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

@Service
public class AITravelService {
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AITravelService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateItinerary(String destination, int days, String preferences, String budget) {
        try {
            // Create request body
            ObjectNode requestBody = objectMapper.createObjectNode();
            ArrayNode contents = requestBody.putArray("contents");
            ObjectNode content = contents.addObject();
            ObjectNode parts = content.putArray("parts").addObject();
            
            String prompt = String.format(
                "Create a detailed %d-day travel itinerary for %s. " +
                "Preferences: %s. Budget: %s. " +
                "Format the response with day-by-day breakdown, including: " +
                "- Morning activities\n" +
                "- Afternoon activities\n" +
                "- Evening activities\n" +
                "- Recommended restaurants\n" +
                "- Estimated costs\n" +
                "- Travel tips",
                days, destination, preferences, budget
            );
            
            parts.put("text", prompt);

            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            // Make the request
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            ResponseEntity<String> response = restTemplate.exchange(
                GEMINI_API_URL,
                HttpMethod.POST,
                entity,
                String.class
            );

            // Parse response
            ObjectNode responseBody = (ObjectNode) objectMapper.readTree(response.getBody());
            return responseBody
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate itinerary: " + e.getMessage());
        }
    }
} 