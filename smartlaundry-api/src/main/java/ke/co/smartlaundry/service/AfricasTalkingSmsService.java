package ke.co.smartlaundry.service;

import jakarta.annotation.PostConstruct;
import ke.co.smartlaundry.configuration.AfricasTalkingProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
        log.info("Africa's Talking SMS initialized: username={}, senderId={}, baseUrl={}",
                props.getUsername(), props.getSenderId(), props.getBaseUrl());
    }

    @Override
    public boolean sendSMS(String phoneNumber, String message) {
        String to = normalizePhone(phoneNumber);
        if (to == null) {
            log.error("❌ Invalid phone number: {}", phoneNumber);
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

        // add both versions for compatibility
        headers.set("apiKey", props.getApiKey());
        headers.set("apikey", props.getApiKey());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        String url = props.getBaseUrl() + "/version1/messaging";

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            Map<String, Object> body = response.getBody();
            log.info("➡ Africa's Talking raw response: {}", body);

            if (body == null) {
                log.error("❌ Null response from Africa's Talking");
                return false;
            }

            Map<String, Object> smsData = (Map<String, Object>) body.get("SMSMessageData");
            if (smsData == null) {
                log.error("❌ Missing SMSMessageData: {}", body);
                return false;
            }

            var recipients = (java.util.List<Map<String, Object>>) smsData.get("Recipients");
            if (recipients == null || recipients.isEmpty()) {
                log.error("❌ No recipients in response: {}", smsData);
                return false;
            }

            Map<String, Object> recipient = recipients.get(0);
            String status = (String) recipient.get("status");

            log.info("📩 SMS to {} | status={} | messageId={} | cost={}",
                    to,
                    status,
                    recipient.get("messageId"),
                    recipient.get("cost")
            );

            return "Success".equalsIgnoreCase(status);

        } catch (Exception ex) {
            log.error("❌ SMS sending failed to {}: {}", to, ex.getMessage(), ex);
            return false;
        }
    }

    private String normalizePhone(String phone) {
        if (phone == null) return null;

        String p = phone.trim().replaceAll("\\s+", "");

        // 07XXXXXXXX → +2547XXXXXXXX
        if (p.matches("^0[17]\\d{8}$")) {
            return "+254" + p.substring(1);
        }

        // +2547XXXXXXXX (valid)
        if (p.startsWith("+2547") && p.length() == 13) {
            return p;
        }

        // 2547XXXXXXXX → +2547XXXXXXXX
        if (p.matches("^2547\\d{8}$")) {
            return "+" + p;
        }

        return null;
    }
}
