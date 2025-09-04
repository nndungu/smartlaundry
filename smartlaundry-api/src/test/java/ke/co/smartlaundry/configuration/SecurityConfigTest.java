package ke.co.smartlaundry.configuration;

import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    // =============================
    // PUBLIC ENDPOINTS
    // =============================

    @Test
    void publicEndpoints_shouldBeAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
        // 405 because it's POST, but it's not blocked by security
    }

    // =============================
    // PROTECTED ENDPOINTS
    // =============================

    @Test
    void protectedEndpoint_shouldReturnUnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    // =============================
    // ROLE-BASED TESTS (WithMockUser)
    // =============================

    @Test
    @WithMockUser(username = "driver@example.com", roles = {"DRIVER"})
    void userRole_shouldNotAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@laundromart.com", roles = {"ADMIN"})
    void adminRole_shouldAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk());
    }

    // =============================
    // JWT-BASED TESTS
    // =============================

    @Test
    void jwtToken_withValidUserRole_shouldBeForbiddenForAdminEndpoint() throws Exception {
        String token = "validUserToken";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn("driver1@example.com");

        UserDetails userDetails = new User(
                "driver1@example.com",
                "driver123",
                Collections.singleton(() -> "ROLE_DRIVER")
        );
        when(userDetailsService.loadUserByUsername("driver1@example.com")).thenReturn(userDetails);

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void jwtToken_withValidAdminRole_shouldAccessAdminEndpoint() throws Exception {
        String token = "validAdminToken";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn("admin@laundromart.com");

        UserDetails userDetails = new User(
                "admin@laundromart.com",
                "admin123",
                Collections.singleton(() -> "ROLE_ADMIN")
        );
        when(userDetailsService.loadUserByUsername("admin@laundromart.com")).thenReturn(userDetails);

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void jwtToken_withInvalidToken_shouldBeUnauthorized() throws Exception {
        String token = "invalidToken";

        when(jwtUtil.validateToken(token)).thenReturn(false);

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    // =============================
    // SELF-SERVICE ENDPOINT (/me)
    // =============================

    @Test
    void selfServiceEndpoint_withValidUserToken_shouldReturnOk() throws Exception {
        String token = "validSelfServiceToken";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn("owner@laundry.com");

        UserDetails userDetails = new User(
                "owner@laundry.com",
                "owner123",
                Collections.singleton(() -> "ROLE_OWNER")
        );
        when(userDetailsService.loadUserByUsername("owner@laundry.com")).thenReturn(userDetails);

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void selfServiceEndpoint_withoutToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    // =============================
    // NEGATIVE SELF-SERVICE TEST
    // =============================

    @Test
    void userRole_shouldNotAccessAnotherUsersProfile() throws Exception {
        String token = "validUserToken";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn("peter@laundromart.com");

        UserDetails userDetails = new User(
                "peter@laundromart.com",
                "password123",
                Collections.singleton(() -> "ROLE_OWNER")
        );
        when(userDetailsService.loadUserByUsername("peter@laundromart.com")).thenReturn(userDetails);

        // User tries to fetch another user's data (id = 99) instead of their own
        mockMvc.perform(get("/api/users/99")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }
}
