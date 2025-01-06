package com.example.springjwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.example.springjwt.models.Trip;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendTripDetails(Trip trip, String recipientEmail) throws MessagingException {
        logger.info("Attempting to send trip details from {} to: {}", fromEmail, recipientEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            logger.debug("Creating email content...");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            
            String emailContent = String.format("""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #2563eb;">Trip Details</h2>
                        <p><strong>Destination:</strong> %s</p>
                        <p><strong>Dates:</strong> %s - %s</p>
                        <p><strong>Notes:</strong> %s</p>
                        
                        <h3 style="color: #2563eb;">Activities:</h3>
                        <ul>
                        %s
                        </ul>
                        
                        <h3 style="color: #2563eb;">Places:</h3>
                        <ul>
                        %s
                        </ul>
                        
                        <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
                            This trip was shared with you via TravelBloom, Travel Planner App.
                        </p>
                    </body>
                </html>
                """,
                trip.getDestination(),
                trip.getStartDate().format(formatter),
                trip.getEndDate().format(formatter),
                trip.getNotes(),
                trip.getActivities() != null ? trip.getActivities().stream()
                    .map(activity -> String.format("<li style='margin-bottom: 8px;'><strong>%s</strong> at %s - %s<br>%s</li>",
                        activity.getName(),
                        activity.getTime(),
                        activity.getLocation(),
                        activity.getNotes()))
                    .reduce("", String::concat) : "",
                trip.getPlaces() != null ? trip.getPlaces().stream()
                    .map(place -> String.format("<li style='margin-bottom: 8px;'><strong>%s</strong><br>%s</li>",
                        place.getName(),
                        place.getNotes()))
                    .reduce("", String::concat) : ""
            );
            
            logger.debug("Setting email parameters...");
            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("Trip Details: " + trip.getDestination());
            helper.setText(emailContent, true);
            
            logger.info("Email content prepared successfully, attempting to send...");
            try {
                mailSender.send(message);
                logger.info("Email sent successfully to: {}", recipientEmail);
            } catch (Exception e) {
                logger.error("Failed to send email. SMTP Configuration: host={}, port={}, username={}", 
                    System.getProperty("spring.mail.host"),
                    System.getProperty("spring.mail.port"),
                    System.getProperty("spring.mail.username"));
                throw e;
            }
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}. Error: {}", recipientEmail, e.getMessage(), e);
            throw new MessagingException("Failed to send email: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while sending email to: {}. Error: {}", recipientEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public void sendAIGeneratedItinerary(String destination, String itinerary, String recipientEmail) throws MessagingException {
        logger.info("Attempting to send AI-generated itinerary from {} to: {}", fromEmail, recipientEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            logger.debug("Creating email content...");
            
            // Convert the itinerary text to HTML with proper line breaks and formatting
            String formattedItinerary = itinerary.lines()
                .map(line -> {
                    if (line.trim().isEmpty()) {
                        return "<br>";
                    }
                    // Check if the line is a day header
                    if (line.toLowerCase().contains("day")) {
                        return String.format(
                            "<h3 style='color: #2563eb; margin-top: 24px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;'>%s</h3>",
                            line.trim()
                        );
                    }
                    // Check if the line contains a time or activity header (contains ":")
                    if (line.contains(":")) {
                        String[] parts = line.split(":", 2);
                        return String.format(
                            "<p style='margin: 12px 0;'><strong style='color: #4B5563;'>%s:</strong>%s</p>",
                            parts[0].trim(),
                            parts.length > 1 ? parts[1] : ""
                        );
                    }
                    // Regular line
                    return String.format("<p style='margin: 8px 0;'>%s</p>", line.trim());
                })
                .collect(java.util.stream.Collectors.joining("\n"));

            String emailContent = String.format("""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #F3F4F6; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                            <h2 style="color: #2563eb; margin-top: 0;">AI-Generated Travel Itinerary</h2>
                            <p style="font-size: 18px; margin-bottom: 0;"><strong>Destination:</strong> %s</p>
                        </div>
                        
                        <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            %s
                        </div>
                        
                        <p style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center; font-style: italic;">
                            This itinerary was generated and shared with you via TravelBloom, Travel Planner App.
                        </p>
                    </body>
                </html>
                """,
                destination,
                formattedItinerary
            );
            
            logger.debug("Setting email parameters...");
            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject("AI-Generated Travel Itinerary for " + destination);
            helper.setText(emailContent, true);
            
            logger.info("Email content prepared successfully, attempting to send...");
            try {
                mailSender.send(message);
                logger.info("Email sent successfully to: {}", recipientEmail);
            } catch (Exception e) {
                logger.error("Failed to send email. SMTP Configuration: host={}, port={}, username={}", 
                    System.getProperty("spring.mail.host"),
                    System.getProperty("spring.mail.port"),
                    System.getProperty("spring.mail.username"));
                throw e;
            }
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}. Error: {}", recipientEmail, e.getMessage(), e);
            throw new MessagingException("Failed to send email: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while sending email to: {}. Error: {}", recipientEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
} 