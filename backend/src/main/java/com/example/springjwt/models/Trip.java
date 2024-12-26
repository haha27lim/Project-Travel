package com.example.springjwt.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String destination;

    @Future(message = "Start date must be in the future")
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Future(message = "End date must be in the future")
    @Column(name = "end_date")
    private LocalDate endDate;
    
    private String notes;
    
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "trip_id")  // Foreign key column in the "activities" table
    private List<Activity> activities = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
