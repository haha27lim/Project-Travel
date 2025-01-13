package com.example.springjwt.controllers;

import com.example.springjwt.models.PasswordResetToken;
import com.example.springjwt.models.User;
import com.example.springjwt.payload.request.PasswordResetRequest;
import com.example.springjwt.payload.response.MessageResponse;
import com.example.springjwt.repository.PasswordResetTokenRepository;
import com.example.springjwt.repository.UserRepository;
import com.example.springjwt.security.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;
    

    @Value("${frontend.url}")
    private String frontendUrl;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestPasswordReset(@RequestParam("email") String email) {
        logger.info("Received password reset request for email: " + email);
        
        try {
            Optional<User> user = userRepository.findByEmail(email);
            if (!user.isPresent()) {
                logger.info("No user found with email: " + email);
                return ResponseEntity.ok(new MessageResponse("If an account exists with this email, a password reset link will be sent."));
            }

            // Delete any existing token for this user
            tokenRepository.findByUser(user.get()).ifPresent(token -> {
                logger.info("Deleting existing token for user: " + email);
                tokenRepository.delete(token);
            });

            
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(
                token,
                user.get(),
                Instant.now().plus(24, ChronoUnit.HOURS)
            );
            tokenRepository.save(resetToken);
            logger.info("Created new reset token for user: " + email);

            
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            try {
                emailService.sendPasswordResetEmail(user.get().getEmail(), resetLink);
                logger.info("Password reset email sent successfully to: " + email);
            } catch (Exception e) {
                logger.error("Failed to send password reset email", e);
                return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Failed to send password reset email. Please try again later."));
            }

            return ResponseEntity.ok(new MessageResponse("If an account exists with this email, a password reset link will be sent."));
        } catch (Exception e) {
            logger.error("Error processing password reset request", e);
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("An error occurred. Please try again later."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(request.getToken());
        
        if (!tokenOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired password reset token"));
        }

        PasswordResetToken resetToken = tokenOptional.get();
        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(new MessageResponse("Password reset token has expired"));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
    }
} 