package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // =========================
    // REGISTER
    // =========================
    @Test
    void registerNewUser_shouldReturnTokenAndUser() throws Exception {
        String json = """
                {
                    "fullName": "Alice Test",
                    "email": "alice@example.com",
                    "password": "password123"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("alice@example.com"));
    }

    // =========================
    // LOGIN
    // =========================
    @Test
    void loginWithValidCredentials_shouldReturnToken() throws Exception {
        // Ensure user exists in DB
        User user = userRepository.findByEmail("customer1@laundromart.ke").orElseThrow();

        String json = """
                {
                    "email": "customer1@laundromart.ke",
                    "password": "customer123"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("customer1@laundromart.ke"));
    }

    @Test
    void loginWithInvalidPassword_shouldReturnUnauthorized() throws Exception {
        String json = """
                {
                    "email": "customer1@laundromart.ke",
                    "password": "wrongpass"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    // =========================
    // FORGOT PASSWORD
    // =========================
    @Test
    void forgotPasswordExistingUser_shouldReturnOk() throws Exception {
        String json = """
                {
                    "email": "customer1@laundromart.ke"
                }
                """;

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("If an account exists with that email, a reset link has been sent."));
    }

    @Test
    void forgotPasswordNonExistentUser_shouldReturnOk() throws Exception {
        String json = """
                {
                    "email": "nonexistent@example.com"
                }
                """;

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("If an account exists with that email, a reset link has been sent."));
    }

    // =========================
    // RESET PASSWORD
    // =========================
    @Test
    void resetPasswordValidToken_shouldReturnOk() throws Exception {
        // Generate token using JwtUtil
        String token = jwtUtil.generateToken("customer1@laundromart.ke");

        String json = String.format("""
                {
                    "token": "%s",
                    "newPassword": "newPassword123"
                }
                """, token);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successful"));
    }

    @Test
    void resetPasswordInvalidToken_shouldReturnBadRequest() throws Exception {
        String json = """
                {
                    "token": "invalidToken",
                    "newPassword": "password123"
                }
                """;

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid or expired token"));
    }

    // =========================
    // JWT AUTH PROTECTION
    // =========================
    @Test
    void accessProtectedEndpointWithValidToken_shouldReturnOk() throws Exception {
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void accessProtectedEndpointWithInvalidToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer invalidToken"))
                .andExpect(status().isUnauthorized());
    }
}

