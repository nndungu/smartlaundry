package ke.co.smartlaundry.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    /**
     * Generic email sender
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("no-reply@smartlaundry.co.ke"); // customize your domain sender
            javaMailSender.send(message);
            log.info("✅ Email sent to {} | subject: {}", to, subject);
        } catch (MailException e) {
            log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Send payment confirmation or status update
     */
    public void sendPaymentNotification(String to, String orderId, double amount, String status) {
        String subject = "Payment Confirmation - SmartLaundry";
        String body = String.format("""
                Hi,
                
                Your payment for order #%s of amount KES %.2f has been marked as %s.
                
                Thank you for trusting SmartLaundry.
                """, orderId, amount, status);

        sendEmail(to, subject, body);
    }

    /**
     * Send OTP code to user
     */
    public void sendOtpEmail(String to, String otpCode) {
        String subject = "SmartLaundry Account Verification Code";
        String body = String.format("""
                Hi,
                
                Your one-time verification code is: %s
                
                This code is valid for 5 minutes.
                Do not share this code with anyone.
                
                — SmartLaundry Team
                """, otpCode);

        sendEmail(to, subject, body);
    }
}
