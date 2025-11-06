package ke.co.smartlaundry.configuration;

import ke.co.smartlaundry.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret",
                "bf343c55a235c3c70b0c45b115987867784cc9e5fac8931c29003f113b7b11287dd2fa80d87c70f6adef647d3a82c72a906f7671efdf379d729425109de2782e");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 3600000L);
        jwtUtil.init();
    }

    @Test
    void generateToken_shouldReturnValidToken() {
        String email = "customer1@smartlaundry.ke";
        String token = jwtUtil.generateToken(email);

        assertThat(token).isNotEmpty();
        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.extractEmail(token)).isEqualTo(email);
    }

    @Test
    void multipleTokens_shouldBeUnique() throws InterruptedException {
        String token1 = jwtUtil.generateToken("a@x.com");
        Thread.sleep(10); // ensure timestamp difference
        String token2 = jwtUtil.generateToken("a@x.com");

        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    void validateToken_shouldFailForTamperedToken() {
        String token = jwtUtil.generateToken("customer1@smartlaundry.ke");
        String tampered = token.substring(0, token.length() - 2) + "aa";

        assertThat(jwtUtil.validateToken(tampered)).isFalse();
    }

    @Test
    void validateToken_shouldFailForExpiredToken() {
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", -1000L);
        jwtUtil.init();

        String expiredToken = jwtUtil.generateToken("x@y.com");
        assertThat(jwtUtil.validateToken(expiredToken)).isFalse();
    }
}
