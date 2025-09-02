package ke.co.smartlaundry.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendEmail(String to, String subject, String body) {
        // TODO: Integrate with real mail sender (JavaMailSender, SendGrid, etc.)
        System.out.println("Sending email to " + to + " | Subject: " + subject + " | Body: " + body);
    }
}
