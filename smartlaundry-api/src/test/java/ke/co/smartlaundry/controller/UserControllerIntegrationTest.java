package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Test
    void adminShouldGetAllUsers() throws Exception {
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void userShouldAccessOwnProfile() throws Exception {
        String token = jwtUtil.generateToken("customer1@laundromart.ke");

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer1@laundromart.ke"));
    }

    @Test
    void adminCanCreateUser() throws Exception {
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        String json = """
                {
                    "username": "Test Staff",
                    "email": "stafftest@example.com",
                    "passwordHash": "staff123",
                    "roleName": "CUSTOMER"
                }
                """;

        mockMvc.perform(post("/api/users")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("stafftest@example.com"));
    }
}

