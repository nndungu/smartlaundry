package ke.co.smartlaundry.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "mpesa")
public class MpesaConfig {

    private String baseUrl = "https://sandbox.safaricom.co.ke";
    private String shortcode = "174379";
    private String passkey;
    private String consumerKey;
    private String consumerSecret;
    private String callbackUrl = "https://api.smartlaundry.co.ke/api/payments/mpesa/callback";

    // Getters and Setters
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getShortcode() { return shortcode; }
    public void setShortcode(String shortcode) { this.shortcode = shortcode; }

    public String getPasskey() { return passkey; }
    public void setPasskey(String passkey) { this.passkey = passkey; }

    public String getConsumerKey() { return consumerKey; }
    public void setConsumerKey(String consumerKey) { this.consumerKey = consumerKey; }

    public String getConsumerSecret() { return consumerSecret; }
    public void setConsumerSecret(String consumerSecret) { this.consumerSecret = consumerSecret; }

    public String getCallbackUrl() { return callbackUrl; }
    public void setCallbackUrl(String callbackUrl) { this.callbackUrl = callbackUrl; }
}
