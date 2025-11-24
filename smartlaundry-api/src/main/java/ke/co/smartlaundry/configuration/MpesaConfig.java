package ke.co.smartlaundry.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "mpesa")
public class MpesaConfig {

    // Getters and Setters
    private String baseUrl = "https://sandbox.safaricom.co.ke";
    private String shortcode = "174379";
    private String passkey;
    private String consumerKey;
    private String consumerSecret;
    private String callbackUrl = "https://api.smartlaundry.co.ke/api/payments/mpesa/callback";

}
