package com.example.springjwt.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.springjwt.models.Trip;
import com.example.springjwt.payload.response.MessageResponse;
import com.example.springjwt.service.TripService;
import com.example.springjwt.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUserTrips(Authentication authentication) {
        return ResponseEntity.ok(tripService.getTripsByUsername(authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<?> getAllTrips(Authentication authentication) {
        return ResponseEntity.ok(tripService.getTripsByUsername(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id, Authentication authentication) {
        return tripService.getTripById(id)
                .filter(trip -> trip.getUser().getUsername().equals(authentication.getName()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .build());
    }

    @PostMapping
    public ResponseEntity<?> createTrip(@Valid @RequestBody Trip trip, Authentication authentication) {
        try {
            Trip created = tripService.createTrip(trip, authentication.getName());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error creating trip: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserTrip(@PathVariable Long id, @Valid @RequestBody Trip trip,
            Authentication authentication) {
        try {
            Optional<Trip> existingTrip = tripService.getTripById(id);
            if (existingTrip.isPresent()
                    && existingTrip.get().getUser().getUsername().equals(authentication.getName())) {
                trip.setId(id);
                Trip updated = tripService.updateTrip(trip);
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You do not have permission to update this trip"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error updating trip: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id, Authentication authentication) {
        try {
            Optional<Trip> trip = tripService.getTripById(id);
            if (trip.isPresent() && trip.get().getUser().getUsername().equals(authentication.getName())) {
                tripService.deleteTrip(id);
                return ResponseEntity.ok(new MessageResponse("Trip deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You do not have permission to delete this trip"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    // For admin to view all trips
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')") // Ensure only admin can access
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    // For admin to view any trip (no restriction)
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Admin-specific access
    public ResponseEntity<Trip> getAdminTripById(@PathVariable Long id) {
        return tripService.getTripById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // For admin to create a trip for any user
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAdminTrip(@Valid @RequestBody Trip trip, @RequestParam String username) {
        try {
            Trip created = tripService.createTrip(trip, username); // Admin provides the username
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error creating trip for admin: " + e.getMessage()));
        }
    }

    // For admin to delete any trip
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAdminTrip(@PathVariable Long id) {
        try {
            tripService.deleteTrip(id);
            return ResponseEntity.ok(new MessageResponse("Trip deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error deleting trip: " + e.getMessage()));
        }
    }

    // For admin to update any trip
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAdminTrip(@PathVariable Long id, @Valid @RequestBody Trip trip) {
        try {
            Optional<Trip> existingTrip = tripService.getTripById(id);
            if (existingTrip.isPresent()) {
                trip.setId(id);
                Trip updated = tripService.updateTrip(trip);
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Trip not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error updating trip: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareTripViaEmail(@PathVariable Long id, @RequestParam String recipientEmail, Authentication authentication) {
        try {
            Optional<Trip> trip = tripService.getTripById(id);
            if (trip.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Trip not found"));
            }
            
            // Verify the authenticated user owns this trip or is an admin
            if (!trip.get().getUser().getUsername().equals(authentication.getName()) &&
                !authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You don't have permission to share this trip"));
            }
            
            emailService.sendTripDetails(trip.get(), recipientEmail);
            return ResponseEntity.ok(new MessageResponse("Trip details sent successfully to " + recipientEmail));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Failed to send email: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }
}
