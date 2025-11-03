package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.LoginRequestDTO;
import ke.co.smartlaundry.dto.RegisterRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql(scripts = "/test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void loginWithValidCustomer_shouldReturnToken() throws Exception {
        LoginRequestDTO loginReq = new LoginRequestDTO();
        loginReq.setEmail("customer1@laundromart.ke");
        loginReq.setPassword("Customer@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("customer1@laundromart.ke"));
    }

    @Test
    void loginWithInvalidPassword_shouldReturnUnauthorized() throws Exception {
        LoginRequestDTO loginReq = new LoginRequestDTO();
        loginReq.setEmail("customer1@laundromart.ke");
        loginReq.setPassword("wrongpass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void accessProtectedEndpointWithAdminToken_shouldReturnOk() throws Exception {
        // Login as admin first
        LoginRequestDTO loginReq = new LoginRequestDTO();
        loginReq.setEmail("admin@laundromart.ke");
        loginReq.setPassword("Admin@123");

        var mvcResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        String response = mvcResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(response).get("token").asText();

        // Call protected endpoint (example: list all users)
        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void registerNewCustomer_shouldReturnTokenAndUser() throws Exception {
        RegisterRequestDTO registerReq = new RegisterRequestDTO();
        registerReq.setUsername("newcustomer");
        registerReq.setEmail("newcustomer@laundromart.ke");
        registerReq.setPassword("Customer@123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("newcustomer@laundromart.ke"))
                .andExpect(jsonPath("$.user.username").value("newcustomer"));
    }

    @Test
    void forgotPassword_shouldReturnOkMessage() throws Exception {
        var request = Map.of("email", "customer1@laundromart.ke");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("If an account exists with that email, a reset link has been sent."));
    }
}
