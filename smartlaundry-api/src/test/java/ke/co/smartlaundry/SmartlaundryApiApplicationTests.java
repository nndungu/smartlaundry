package ke.co.smartlaundry;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = "admin.registration.passcode=TEST_PASSCODE")
class SmartlaundryApiApplicationTests {

    @Test
    @DisplayName("Application context should load successfully under test profile")
    void contextLoads() {
    }
}
