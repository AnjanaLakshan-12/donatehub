package org.example.donatehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String firstName, String lastName, String userEmail, String phone, String userMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("anjanalakshan186@gmail.com");
        message.setSubject("New Message from " + firstName + " " + lastName);

        message.setText(
                "Name: " + firstName + " " + lastName + "\n" +
                "Email: " + userEmail + "\n" +
                "Phone: " + (phone != null && !phone.isEmpty() ? phone : "Not provided") + "\n\n" +
                "Message:\n" + userMessage
        );

        mailSender.send(message);
    }
}