package com.hostmyevent.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    // In-memory store for OTPs (For production, use Redis or Database)
    private final ConcurrentHashMap<String, String> otpStorage = new ConcurrentHashMap<>();

    public void sendOtpEmail(String toEmail) {
        String otp = generateOtp();
        otpStorage.put(toEmail, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@hostmyevent.com");
        message.setTo(toEmail);
        message.setSubject("Your HostMyEvent Login OTP");
        message.setText("Welcome back to HostMyEvent!\n\nYour One-Time Password (OTP) is: " + otp
                + "\n\nThis OTP is valid for 5 minutes.");

        // javaMailSender.send(message);
        // NOTE: Commented out actual sending to prevent crash since credentials are
        // placeholders.
        System.out.println("SIMULATED EMAIL SENT TO " + toEmail + " WITH OTP: " + otp);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email); // OTP is single-use
            return true;
        }
        return false;
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
