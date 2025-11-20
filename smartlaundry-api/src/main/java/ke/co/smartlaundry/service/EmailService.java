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
     * Generic email sender via Brevo SMTP
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("SmartLaundry <no-reply@smartlaundry.com>");

            mailSender.send(message);

            log.info("📧 Email sent to {} | {}", to, subject);

        } catch (MailException e) {
            log.error("❌ Email FAILED to {} | error={}", to, e.getMessage());
        }
    }

    /**
     * OTP Email
     */
    public void sendOtpEmail(String to, String otpCode) {
        String subject = "Your SmartLaundry Verification Code";
        String body =
                "Your SmartLaundry verification code is:\n\n" +
                        "OTP: " + otpCode + "\n\n" +
                        "This code expires in 5 minutes.\n" +
                        "Do NOT share this code with anyone.\n\n" +
                        "— SmartLaundry Team";

        sendEmail(to, subject, body);
    }

    /**
     * Payment Notification Email
     */
    public void sendPaymentNotification(String to, String orderId, double amount, String status) {
        String subject = "SmartLaundry Payment Receipt";
        String body =
                "Your payment details:\n\n" +
                        "Order ID: " + orderId + "\n" +
                        "Amount: KES " + String.format("%.2f", amount) + "\n" +
                        "Status: " + status + "\n\n" +
                        "Thank you for using SmartLaundry!";

        sendEmail(to, subject, body);
    }
}
