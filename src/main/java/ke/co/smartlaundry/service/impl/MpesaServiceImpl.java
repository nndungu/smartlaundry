package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.service.MpesaService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MpesaServiceImpl implements MpesaService {

    @Value("${MPESA_BASEURL}")
    private String baseUrl;

    @Value("${MPESA_SHORTCODE}")
    private String shortcode;

    @Value("${MPESA_PASSKEY}")
    private String passkey;

    @Value("${MPESA_CONSUMERKEY}")
    private String consumerKey;

    @Value("${MPESA_CONSUMERSECRET}")
    private String consumerSecret;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper om = new ObjectMapper();

    @Override
    public boolean initiateSTKPush(String phone, double amount, String transactionRef, String description) {
        // minimal STK push scaffolding: you must provide credentials and proper payloads for production
        try {
            // get access token
            String tokenUrl = "https://" + baseUrl + "/oauth/v1/generate?grant_type=client_credentials";
            HttpHeaders h = new HttpHeaders();
            h.setBasicAuth(consumerKey, consumerSecret);
            h.setAccept(List.of(MediaType.APPLICATION_JSON));
            var resp = rest.exchange(tokenUrl, HttpMethod.GET, new HttpEntity<>(h), String.class);
            JsonNode root = om.readTree(resp.getBody());
            String access = root.path("access_token").asText();

            // build payload
            HttpHeaders hdr = new HttpHeaders();
            hdr.setContentType(MediaType.APPLICATION_JSON);
            hdr.setBearerAuth(access);
            Map<String,Object> payload = new HashMap<>();
            payload.put("BusinessShortCode", shortcode);
            // password is base64(businessShortCode + passkey + timestamp) for Daraja
            String timestamp = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            String pwd = Base64.getEncoder().encodeToString((shortcode + passkey + timestamp).getBytes());
            payload.put("Password", pwd);
            payload.put("Timestamp", timestamp);
            payload.put("TransactionType", "CustomerPayBillOnline");
            payload.put("Amount", (int)Math.round(amount));
            payload.put("PartyA", phone);
            payload.put("PartyB", shortcode);
            payload.put("PhoneNumber", phone);
            payload.put("CallBackURL", "https://your-server.com/api/payments/callback/mpesa");
            payload.put("AccountReference", transactionRef);
            payload.put("TransactionDesc", description);

            var ent = new HttpEntity<>(om.writeValueAsString(payload), hdr);
            var stkUrl = "https://" + baseUrl + "/mpesa/stkpush/v1/processrequest";
            var r = rest.postForEntity(stkUrl, ent, String.class);
            JsonNode res = om.readTree(r.getBody());
            return res.path("ResponseCode").asText().equals("0");
        } catch (Exception ex) {
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
            // ignore
        }
        return out;
    }
}
