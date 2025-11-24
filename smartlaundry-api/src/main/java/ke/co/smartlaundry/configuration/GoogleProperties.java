package ke.co.smartlaundry.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "google")
public class GoogleProperties {

    // Getters and Setters
    private String clientId;
    private String clientSecret;
    private String redirectUri;

}
