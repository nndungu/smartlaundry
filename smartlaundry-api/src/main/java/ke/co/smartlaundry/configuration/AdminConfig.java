package ke.co.smartlaundry.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "admin.registration")
@Getter
@Setter
public class AdminConfig {
    /**
     * Admin registration passcode.
     * Default fallback is "SMART_CODE" if not set in env or properties
     */
    private String passcode = "SMART_CODE";
}
