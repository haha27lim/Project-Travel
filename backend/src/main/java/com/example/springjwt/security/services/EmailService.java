package com.example.springjwt.security.services;

public interface EmailService {
    void sendPasswordResetEmail(String to, String resetLink);
} 