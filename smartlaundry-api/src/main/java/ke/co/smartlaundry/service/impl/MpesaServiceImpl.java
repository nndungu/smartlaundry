package ke.co.smartlaundry.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.configuration.MpesaConfig;
import ke.co.smartlaundry.service.MpesaService;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MpesaServiceImpl implements MpesaService {

    private final MpesaConfig config;
    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper om = new ObjectMapper();

    public MpesaServiceImpl(MpesaConfig config) {
        this.config = config;
    }

    @Override
    public boolean initiateSTKPush(String phone, double amount, String transactionRef, String description) {
        try {
            // 1. Get access token
            String tokenUrl = config.getBaseUrl() + "/oauth/v1/generate?grant_type=client_credentials";
            HttpHeaders h = new HttpHeaders();
            h.setBasicAuth(config.getConsumerKey(), config.getConsumerSecret());
            h.setAccept(List.of(MediaType.APPLICATION_JSON));
            var resp = rest.exchange(tokenUrl, HttpMethod.GET, new HttpEntity<>(h), String.class);
            JsonNode root = om.readTree(resp.getBody());
            String access = root.path("access_token").asText();

            // 2. Build STK push payload
            HttpHeaders hdr = new HttpHeaders();
            hdr.setContentType(MediaType.APPLICATION_JSON);
            hdr.setBearerAuth(access);

            Map<String,Object> payload = new HashMap<>();
            payload.put("BusinessShortCode", config.getShortcode());

            String timestamp = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String pwd = Base64.getEncoder().encodeToString((config.getShortcode() + config.getPasskey() + timestamp).getBytes());
            payload.put("Password", pwd);
            payload.put("Timestamp", timestamp);
            payload.put("TransactionType", "CustomerPayBillOnline");
            payload.put("Amount", (int)Math.round(amount));
            payload.put("PartyA", phone);
            payload.put("PartyB", config.getShortcode());
            payload.put("PhoneNumber", phone);
            payload.put("CallBackURL", config.getCallbackUrl());
            payload.put("AccountReference", transactionRef);
            payload.put("TransactionDesc", description);

            var ent = new HttpEntity<>(om.writeValueAsString(payload), hdr);
            var stkUrl = config.getBaseUrl() + "/mpesa/stkpush/v1/processrequest";

            var r = rest.postForEntity(stkUrl, ent, String.class);
            JsonNode res = om.readTree(r.getBody());

            return res.path("ResponseCode").asText().equals("0");
        } catch (Exception ex) {
            ex.printStackTrace(); // log the error
            return false;
        }
    }

    @Override
    public Map<String, Object> parseCallback(String body) {
        Map<String,Object> out = new HashMap<>();
        try {
            JsonNode root = om.readTree(body);
            JsonNode cb = root.path("Body").path("stkCallback");
            out.put("CheckoutRequestID", cb.path("CheckoutRequestID").asText());
            out.put("ResultCode", cb.path("ResultCode").asInt());
            out.put("ResultDesc", cb.path("ResultDesc").asText());
        } catch (Exception ex) {
            ex.printStackTrace(); // log parsing errors
        }
        return out;
    }
}
