package ke.co.smartlaundry.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.util.Map;

@Service
@Profile("!test")
public class AfricasTalkingSmsService implements SMSService {

    private static final Logger log = LoggerFactory.getLogger(AfricasTalkingSmsService.class);

    private final RestTemplate restTemplate;
    private final String username;
    private final String apiKey;
    private final String senderId;
    private final String baseUrl;

    public AfricasTalkingSmsService(
            @Value("${africastalking.base-url:https://api.africastalking.com}") String baseUrl,
            @Value("${africastalking.username}") String username,
            @Value("${africastalking.apiKey}") String apiKey,
            @Value("${africastalking.senderId:}") String senderId
    ) {
        this.restTemplate = new RestTemplate();
        this.username = username;
        this.apiKey = apiKey;
        this.senderId = senderId;
        this.baseUrl = baseUrl;
    }

    @PostConstruct
    void init() {
        log.info("Africa's Talking SMS service initialized (username={})", username);
    }

    @Override
    public boolean sendSMS(String phoneNumber, String message) {
        String to = normalizePhone(phoneNumber);
        if (to == null) {
            log.error("Invalid phone number: {}", phoneNumber);
            return false;
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", username);
        form.add("to", to);
        form.add("message", message);
        if (senderId != null && !senderId.isBlank()) {
            form.add("from", senderId);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("apiKey", apiKey);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    baseUrl + "/version1/messaging",
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
