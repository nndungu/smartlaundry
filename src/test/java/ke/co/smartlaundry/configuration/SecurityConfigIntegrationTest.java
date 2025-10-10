package ke.co.smartlaundry.configuration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test") // Optional: if you have a separate test profile
class SecurityConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    // Use seeded admin user from H2
    @Test
    void validToken_shouldAccessProtectedEndpoint() throws Exception {
        // Generate a valid JWT for the admin user seeded in H2
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void invalidToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer invalidToken"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void noToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void userToken_shouldBeForbiddenForAdminEndpoint() throws Exception {
        // Generate a valid JWT for a normal user (driver)
        String token = jwtUtil.generateToken("driver1@laundromart.ke");

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }
}
