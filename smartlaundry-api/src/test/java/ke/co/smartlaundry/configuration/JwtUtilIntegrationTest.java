package ke.co.smartlaundry.configuration;

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
    void shouldGenerateAndValidateToken() {
        String email = "customer1@laundromart.ke";
        String token = jwtUtil.generateToken(email);

        assertThat(token).isNotBlank();
        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.extractEmail(token)).isEqualTo(email);
    }

    @Test
    void shouldInvalidateTamperedToken() {
        String token = jwtUtil.generateToken("customer1@laundromart.ke");
        String tampered = token.substring(0, token.length() - 1) + "X";

        assertThat(jwtUtil.validateToken(tampered)).isFalse();
    }
}
