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
} 