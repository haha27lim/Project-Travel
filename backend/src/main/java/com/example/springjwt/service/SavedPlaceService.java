package com.example.springjwt.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springjwt.models.SavedPlace;
import com.example.springjwt.repository.SavedPlaceRepository;
import com.example.springjwt.repository.UserRepository;

@Service
public class SavedPlaceService {

    @Autowired
    private SavedPlaceRepository savedPlaceRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<SavedPlace> getSavedPlacesByUsername(String username) {
        return savedPlaceRepository.findByUser_Username(username);
    }

    public Optional<SavedPlace> getSavedPlaceById(Long id) {
        return savedPlaceRepository.findById(id);
    }

    public SavedPlace createSavedPlace(SavedPlace place, String username) {
        place.setUser(userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found")));
        return savedPlaceRepository.save(place);
    }

    public SavedPlace updateSavedPlace(SavedPlace place) {
        Optional<SavedPlace> existingPlaceOpt = savedPlaceRepository.findById(place.getId());
        
        if (existingPlaceOpt.isPresent()) {
            SavedPlace existingPlace = existingPlaceOpt.get();
            
            existingPlace.setName(place.getName());
            existingPlace.setNotes(place.getNotes());
            existingPlace.setImageUrl(place.getImageUrl());
            
            return savedPlaceRepository.save(existingPlace);
        } else {
            throw new RuntimeException("Place not found with id: " + place.getId());
        }
    }

    public void deleteSavedPlace(Long id) {
        if (!savedPlaceRepository.existsById(id)) {
            throw new RuntimeException("Place not found with id: " + id);
        }
        savedPlaceRepository.deleteById(id);
    }
} 