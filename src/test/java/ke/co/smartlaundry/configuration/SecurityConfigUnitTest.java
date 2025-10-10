package ke.co.smartlaundry.configuration;

import ke.co.smartlaundry.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigUnitTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @Test
    void protectedEndpoint_withoutToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void jwtToken_invalid_shouldReturnUnauthorized() throws Exception {
        String invalidToken = "invalidToken";

        when(jwtUtil.validateToken(invalidToken)).thenReturn(false);

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void jwtToken_validUserRole_shouldBeForbiddenForAdminEndpoint() throws Exception {
        String token = "userToken";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn("driver1@laundromart.ke");

        UserDetails userDetails = new User(
                "driver1@laundromart.ke",
                "password",
                Collections.singleton(() -> "ROLE_DRIVER")
        );
        when(userDetailsService.loadUserByUsername("driver1@laundromart.ke")).thenReturn(userDetails);

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void jwtToken_validAdminRole_shouldAccessAdminEndpoint() throws Exception {
        String token = "adminToken";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getEmailFromToken(token)).thenReturn("admin@laundromart.ke");

        UserDetails userDetails = new User(
                "admin@laundromart.ke",
                "password",
                Collections.singleton(() -> "ROLE_ADMIN")
        );
        when(userDetailsService.loadUserByUsername("admin@laundromart.ke")).thenReturn(userDetails);

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
