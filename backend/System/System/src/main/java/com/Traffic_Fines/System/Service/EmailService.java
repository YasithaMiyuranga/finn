package com.Traffic_Fines.System.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@gmail.com"); // This will be overridden by application.properties
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Traffic Fine System - Password Reset OTP";
        String body = "Dear User,\n\n" +
                "You requested a password reset. Your OTP is: " + otp + "\n" +
                "This OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\n" +
                "Regards,\n" +
                "eTRAFFIC System Team";
        sendEmail(to, subject, body);
    }
}
