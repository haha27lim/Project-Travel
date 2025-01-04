package com.example.springjwt.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springjwt.models.Trip;
import com.example.springjwt.repository.TripRepository;
import com.example.springjwt.repository.UserRepository;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    public List<Trip> getTripsByUsername(String username) {
        return tripRepository.findByUser_Username(username);
    }

    public Trip createTrip(Trip trip, String username) {
        trip.setUser(userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found")));
        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip not found with id: " + id);
        }
        tripRepository.deleteById(id);
    }

    public Trip updateTrip(Trip trip) {

        Optional<Trip> existingTripOpt = tripRepository.findById(trip.getId());
        
        // If the trip exists, update its details
        if (existingTripOpt.isPresent()) {
            Trip existingTrip = existingTripOpt.get();
            
            existingTrip.setDestination(trip.getDestination());
            existingTrip.setStartDate(trip.getStartDate());
            existingTrip.setEndDate(trip.getEndDate());
            existingTrip.setNotes(trip.getNotes());
            existingTrip.setActivities(trip.getActivities());
            existingTrip.setPlaces(trip.getPlaces());
            
            return tripRepository.save(existingTrip);
        } else {
            throw new RuntimeException("Trip not found with id: " + trip.getId());
        }
    }

}
