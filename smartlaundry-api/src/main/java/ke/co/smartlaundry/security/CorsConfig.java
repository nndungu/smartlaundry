package ke.co.smartlaundry.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "https://smartlaundryclient.onrender.com",
                "https://yvette-diminished-draconially.ngrok-free.dev",
                "http://localhost:4200",
                "http://localhost:5173"
        ));

        config.setAllowedMethods(List.of("*"));   // allow all HTTP methods
        config.setAllowedHeaders(List.of("*"));   // allow all headers
        config.setExposedHeaders(List.of("*"));   // allow reading all response headers
        config.setAllowCredentials(true);         // allow cookies / tokens

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
