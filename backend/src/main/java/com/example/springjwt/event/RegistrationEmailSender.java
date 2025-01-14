package com.example.springjwt.event;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.example.springjwt.models.User;

import java.io.UnsupportedEncodingException;

@Component
public class RegistrationEmailSender implements ApplicationListener<RegistrationCompleteEvent> {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${frontend.url}")
    private String frontendUrl;

    private User theUser;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        // 1. Get the newly registered user
        theUser = event.getUser();
        // 2. Build the home URL to be sent to the user
        String url = frontendUrl;
        // 3. Send the welcome email.
        try {
            sendRegistrationEmail(url);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendRegistrationEmail(String url) throws MessagingException, UnsupportedEncodingException {
        String subject = "TravelBloom: Registration Successful";
        String senderName = "TravelBloom - User Registration";
        String mailContent = "<p><img src='cid:logo' width='700' height='400''/></p>" +
                "<p><span style='color: #000000;'> Hi, " + theUser.getUsername() + ", </span></p>" +
                "<p><span style='color: #000000;'>Thank you for successfully registering with us. " +
                "Your account has been successfully created.</span></p>" +
                "<p><span style='color: #000000;'>Welcome to our community! We're thrilled to have you on board.</span></p>"
                +
                "<p><a href=\"" + url + "\">Click here to login</a></p>" +
                "<p><b style='color: #000000;'> Thank you, <br> TravelBloom - User Registration</b></p>";
        ;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);
        messageHelper.setFrom(fromEmail, senderName);
        messageHelper.setTo(theUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);

        ClassPathResource resource = new ClassPathResource("/static/images/emailpic.jpg");
        messageHelper.addInline("logo", resource);

        mailSender.send(message);
    }
}
