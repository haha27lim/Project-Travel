package com.example.springjwt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.springjwt.services.AITravelService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AITravelController {

    @Autowired
    private AITravelService aiTravelService;

    @PostMapping("/generate-itinerary")
    public ResponseEntity<?> generateItinerary(
            @RequestParam String destination,
            @RequestParam int days,
            @RequestParam(required = false, defaultValue = "standard tourist attractions") String preferences,
            @RequestParam(required = false, defaultValue = "moderate") String budget) {
        
        try {
            String itinerary = aiTravelService.generateItinerary(destination, days, preferences, budget);
            return ResponseEntity.ok(itinerary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to generate itinerary: " + e.getMessage());
        }
    }
} 