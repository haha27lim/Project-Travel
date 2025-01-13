package com.example.springjwt.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceImpl implements EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password Reset Request");
            message.setText("To reset your password, click the link below:\n\n" + resetLink + 
                          "\n\nIf you did not request a password reset, please ignore this email.");
            
            logger.info("Attempting to send password reset email to: " + to);
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: " + to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: " + to, e);
            throw e;
        }
    }
} 