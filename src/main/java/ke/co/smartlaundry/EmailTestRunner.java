package ke.co.smartlaundry;

import ke.co.smartlaundry.service.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmailTestRunner implements CommandLineRunner {

    private final EmailService emailService;

    public EmailTestRunner(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void run(String... args) throws Exception {
        emailService.sendEmail(
                "ncaleb52@gmail.com",
                "Test Email",
                "Hello! This is a test email from SmartLaundry."
        );
    }
}
