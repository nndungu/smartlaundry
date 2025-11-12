package ke.co.smartlaundry.service;

import jakarta.annotation.PostConstruct;
import ke.co.smartlaundry.configuration.AfricasTalkingProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AfricasTalkingSmsService implements SMSService {

    private static final Logger log = LoggerFactory.getLogger(AfricasTalkingSmsService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final AfricasTalkingProperties props;

    public AfricasTalkingSmsService(AfricasTalkingProperties props) {
        this.props = props;
    }

    @PostConstruct
    void init() {
        log.info("Africa's Talking SMS service initialized (username={})", props.getUsername());
    }

    @Override
    public boolean sendSMS(String phoneNumber, String message) {
        String to = normalizePhone(phoneNumber);
        if (to == null) {
            log.error("Invalid phone number: {}", phoneNumber);
            return false;
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", props.getUsername());
        form.add("to", to);
        form.add("message", message);
        if (props.getSenderId() != null && !props.getSenderId().isBlank()) {
            form.add("from", props.getSenderId());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("apiKey", props.getApiKey());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    props.getBaseUrl() + "/version1/messaging",
                    request,
                    Map.class
            );

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("SMSMessageData")) {
                log.info("SMS sent to {} (message len={})", to, message.length());
                return true;
            } else {
                log.warn("Unexpected response from Africa's Talking: {}", body);
                return false;
            }

        } catch (Exception ex) {
            log.error("Failed to send SMS to {}: {}", to, ex.getMessage(), ex);
            return false;
        }
    }

    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String p = phone.trim().replaceAll("\\s+", "");
        if (p.matches("^0\\d{8,}$")) return "+254" + p.substring(1);
        if (p.startsWith("+") && p.length() >= 8) return p;
        if (p.matches("^\\d{9,}$")) return "+" + p;
        return null;
    }
}
