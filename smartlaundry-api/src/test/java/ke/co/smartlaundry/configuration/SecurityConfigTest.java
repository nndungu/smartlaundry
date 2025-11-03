package ke.co.smartlaundry.configuration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.SecurityFilterChain;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SecurityConfigTest {

    @Autowired
    private SecurityFilterChain filterChain;

    @Test
    void contextLoadsAndFilterChainExists() {
        assertThat(filterChain).isNotNull();
    }
}
