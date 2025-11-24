package ke.co.smartlaundry.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "africastalking")
public class AfricasTalkingProperties {

    // --- Getters & Setters ---
    private String baseUrl = "https://api.africastalking.com";

    private String username;

    private String apiKey;

    private String senderId;

}
