package ke.co.smartlaundry.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile({"test", "local", "dev"})
public class NoopSmsService implements SMSService {
    private static final Logger log = LoggerFactory.getLogger(NoopSmsService.class);

    @Override
    public boolean sendSMS(String phoneNumber, String message) {
        log.info("[NOOP SMS] to {}: {}", phoneNumber, message);
        return true;
    }
}
