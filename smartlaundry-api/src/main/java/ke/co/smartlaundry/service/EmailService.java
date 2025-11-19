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
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
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
            message.setFrom("SmartLaundry <" + "nndungu7@gmail.com" + ">"); // safer for Gmail SMTP
            mailSender.send(message);

            log.info("📧 Email sent to {} | subject={}", to, subject);

        } catch (MailException e) {
            log.error("❌ Email send FAILED to {} | error={}", to, e.getMessage());
        }
    }

    /**
     * Send OTP Verification Email
     */
    public void sendOtpEmail(String to, String otpCode) {
        String subject = "Your SmartLaundry Verification Code";
        String body = String.format("""
                Hello,

                Your SmartLaundry one-time verification code is:

                🔐 OTP: %s

                This code expires in 5 minutes.
                Please do NOT share this code with anyone.

                — SmartLaundry Team
                """, otpCode);

        sendEmail(to, subject, body);
    }

    /**
     * Payment Notification
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
}
