package com.example.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springjwt.models.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser_Username(String username);
}
