package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.PasswordResetToken;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import ke.co.smartlaundry.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final SMSService smsService;
    private final PasswordEncoder passwordEncoder;

    private static final long EXPIRATION_MINUTES = 30;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                EmailService emailService,
                                SMSService smsService,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.smsService = smsService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Step 1: Initiate reset (send email + SMS OTP)
     */
    @Transactional
    public void initiateReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = UUID.randomUUID().toString();
        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setOtp(otp);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        resetToken.setOtpVerified(false);

        tokenRepository.save(resetToken);

        // Email with link + OTP info
        String resetLink = "https://smartlaundry.co.ke/reset-password?token=" + token;
        String emailBody = "Hi " + user.getUsername() + ",\n\n" +
                "Click this link to reset your password: " + resetLink +
                "\nYour SMS OTP is: " + otp;
        emailService.sendEmail(user.getEmail(), "Password Reset Request", emailBody);

        // SMS OTP
        smsService.sendSMS(user.getPhoneNumber(), "Your SmartLaundry OTP is: " + otp);
    }

    /**
     * Step 2: Verify OTP before allowing password reset
     */
    @Transactional
    public void verifyOtp(String token, String otp) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now()))
            throw new IllegalStateException("Token expired");

        if (!resetToken.getOtp().equals(otp))
            throw new IllegalArgumentException("Invalid OTP");

        resetToken.setOtpVerified(true);
        tokenRepository.save(resetToken);
    }

    /**
     * Step 3: Reset password
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (!resetToken.isOtpVerified())
            throw new IllegalStateException("OTP not verified");

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now()))
            throw new IllegalStateException("Token expired");

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Token is one-time use
        tokenRepository.delete(resetToken);
    }
}
