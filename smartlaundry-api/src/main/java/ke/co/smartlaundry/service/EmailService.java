package ke.co.smartlaundry.service;

import com.sendinblue.ApiClient;
import com.sendinblue.ApiException;
import com.sendinblue.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sibApi.TransactionalEmailsApi;
import sibModel.*;

import java.util.Collections;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final TransactionalEmailsApi emailApi;

    public EmailService(@Value("${BREVO_API_KEY}") String apiKey) {
        ApiClient client = Configuration.getDefaultApiClient();
        client.setApiKey(apiKey);
        this.emailApi = new TransactionalEmailsApi(client);
    }

    /**
     * Generic Email Sender
     */
    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            SendSmtpEmail email = new SendSmtpEmail()
                    .sender(new SendSmtpEmailSender()
                            .name("SmartLaundry")
                            .email("no-reply@smartlaundry.com"))
                    .to(Collections.singletonList(new SendSmtpEmailTo().email(to)))
                    .subject(subject)
                    .htmlContent(htmlBody);

            emailApi.sendTransacEmail(email);

            log.info("📧 Email sent to {} | {}", to, subject);

        } catch (ApiException e) {
            log.error("❌ Email FAILED to {} | {}", to, e.getResponseBody());
        }
    }

    /**
     * OTP Verification Email
     */
    public void sendOtpEmail(String to, String otpCode) {
        String subject = "Your SmartLaundry Verification Code";
        String htmlBody = """
                <h2>Your SmartLaundry Verification Code</h2>
                <p>Your OTP code is:</p>
                <h1 style="font-size:28px; letter-spacing:3px;">""" + otpCode + """</h1>
                <p>This code expires in 5 minutes. Do NOT share it with anyone.</p>
                <br>
                <p>— SmartLaundry Team</p>
                """;

        sendEmail(to, subject, htmlBody);
    }

    /**
     * Payment Notification Email
     */
    public void sendPaymentNotification(String to, String orderId, double amount, String status) {
        String subject = "SmartLaundry Payment Receipt";
        String htmlBody = """
                <h2>Payment Update</h2>
                <p>Your payment details are as follows:</p>
                <ul>
                    <li><b>Order:</b> """ + orderId + """</li>
                    <li><b>Amount:</b> KES """ + String.format("%.2f", amount) + """</li>
                    <li><b>Status:</b> """ + status + """</li>
                </ul>
                <p>Thank you for using SmartLaundry!</p>
                """;

        sendEmail(to, subject, htmlBody);
    }
}
