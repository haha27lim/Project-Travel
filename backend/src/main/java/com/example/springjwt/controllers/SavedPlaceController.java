package com.example.springjwt.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springjwt.models.SavedPlace;
import com.example.springjwt.payload.response.MessageResponse;
import com.example.springjwt.service.SavedPlaceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SavedPlaceController {

    @Autowired
    private SavedPlaceService savedPlaceService;

    @GetMapping("/saved")
    public ResponseEntity<List<SavedPlace>> getSavedPlaces(Authentication authentication) {
        List<SavedPlace> places = savedPlaceService.getSavedPlacesByUsername(authentication.getName());
        return ResponseEntity.ok(places);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSavedPlaceById(@PathVariable Long id, Authentication authentication) {
        Optional<SavedPlace> place = savedPlaceService.getSavedPlaceById(id);
        
        return place.filter(p -> p.getUser().getUsername().equals(authentication.getName()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @PostMapping
    public ResponseEntity<?> createSavedPlace(@Valid @RequestBody SavedPlace place, Authentication authentication) {
        try {
            SavedPlace created = savedPlaceService.createSavedPlace(place, authentication.getName());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error creating saved place: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSavedPlace(
            @PathVariable Long id,
            @Valid @RequestBody SavedPlace place,
            Authentication authentication) {
        try {
            Optional<SavedPlace> existingPlace = savedPlaceService.getSavedPlaceById(id);
            if (existingPlace.isPresent() && 
                existingPlace.get().getUser().getUsername().equals(authentication.getName())) {
                place.setId(id);
                SavedPlace updated = savedPlaceService.updateSavedPlace(place);
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You do not have permission to update this place"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error updating saved place: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavedPlace(@PathVariable Long id, Authentication authentication) {
        try {
            Optional<SavedPlace> place = savedPlaceService.getSavedPlaceById(id);
            if (place.isPresent() && 
                place.get().getUser().getUsername().equals(authentication.getName())) {
                savedPlaceService.deleteSavedPlace(id);
                return ResponseEntity.ok(new MessageResponse("Place deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You do not have permission to delete this place"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(e.getMessage()));
        }
    }
} 