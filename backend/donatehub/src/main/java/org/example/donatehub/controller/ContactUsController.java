package org.example.donatehub.controller;

import org.example.donatehub.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactUsController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/submit")
    public ResponseEntity<String> sendMessage(@RequestParam String firstName,
                                               @RequestParam String lastName,
                                               @RequestParam String email,
                                               @RequestParam(required = false) String phone,
                                               @RequestParam String message) {
        try {
            emailService.sendEmail(firstName, lastName, email, phone, message);
            return ResponseEntity.ok("Thank you for contacting us! We'll get back to you soon.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send message. Please try again later.");
        }
    }
}
