package ke.co.smartlaundry.configuration;

import ke.co.smartlaundry.security.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class JwtUtilIntegrationTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("Should generate a valid token and extract correct email")
    void generateAndValidateToken() {
        String email = "customer1@smartlaundry.ke";

        String token = jwtUtil.generateToken(email);
        boolean isValid = jwtUtil.validateToken(token);
        String extractedEmail = jwtUtil.extractEmail(token);

        assertThat(token).isNotBlank();
        assertThat(isValid).isTrue();
        assertThat(extractedEmail).isEqualTo(email);
    }

    @Test
    @DisplayName("Should invalidate tampered token")
    void invalidateTamperedToken() {
        String token = jwtUtil.generateToken("customer1@smartlaundry.ke");
        String tampered = token.substring(0, token.length() - 1) + "X";

        boolean isValid = jwtUtil.validateToken(tampered);

        assertThat(isValid).isFalse();
    }
}
