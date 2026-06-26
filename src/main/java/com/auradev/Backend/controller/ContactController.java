package com.auradev.Backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auradev.Backend.dto.ContactRequest;
import com.auradev.Backend.model.ContactMessage;
import com.auradev.Backend.repository.ContactMessageRepository;

@RestController
@RequestMapping("/api/v1")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public ContactController(ContactMessageRepository contactMessageRepository, JavaMailSender javaMailSender) {
        this.contactMessageRepository = contactMessageRepository;
        this.javaMailSender = javaMailSender;
    }

    @PostMapping("/contact")
    public ResponseEntity<?> contact(@RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        contactMessageRepository.save(message);

        if (mailUsername == null || mailUsername.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "success", false,
                            "message", "Message saved, but email is not configured in application.properties."));
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(mailUsername);
            mailMessage.setFrom(mailUsername);
            mailMessage.setReplyTo(request.getEmail());
            mailMessage.setSubject("New contact message from " + request.getName());
            mailMessage.setText(
                    "Name: " + request.getName() + "\n"
                            + "Email: " + request.getEmail() + "\n\n"
                            + "Message:\n" + request.getMessage());
            javaMailSender.send(mailMessage);
        } catch (MailException exception) {
            logger.error("Contact message was saved, but email delivery failed", exception);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message",
                            "Message saved, but email could not be sent. Check the backend console for the SMTP error and verify the Gmail app password."));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Message sent successfully"));
    }
}
