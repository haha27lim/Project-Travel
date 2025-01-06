package com.example.springjwt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.springjwt.service.AITravelService;
import com.example.springjwt.service.EmailService;
import com.example.springjwt.models.Trip;
import com.example.springjwt.payload.response.MessageResponse;
import com.example.springjwt.payload.request.ShareItineraryRequest;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AITravelController {

    @Autowired
    private AITravelService aiTravelService;

    @Autowired
    private EmailService emailService;

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

    @PostMapping("/share-itinerary")
    public ResponseEntity<?> shareItinerary(@RequestBody @Valid ShareItineraryRequest request) {
        try {
            emailService.sendAIGeneratedItinerary(
                request.getDestination(),
                request.getItinerary(),
                request.getRecipientEmail()
            );
            return ResponseEntity.ok(new MessageResponse("Itinerary shared successfully"));
        } catch (MessagingException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to share itinerary: " + e.getMessage()));
        }
    }
} 