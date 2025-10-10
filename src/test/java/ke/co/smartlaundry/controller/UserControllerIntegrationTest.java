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

import jakarta.transaction.Transactional;
import org.springframework.test.web.servlet.MockMvc;

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

    // =========================
    // GET ALL USERS - Admin only
    // =========================
    @Test
    void adminShouldGetAllUsers() throws Exception {
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").exists());
    }

    @Test
    void nonAdminShouldBeForbiddenFromGettingAllUsers() throws Exception {
        String token = jwtUtil.generateToken("customer1@laundromart.ke");

        mockMvc.perform(get("/api/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    // =========================
    // GET USER BY ID - Admin only
    // =========================
    @Test
    void adminShouldGetUserById() throws Exception {
        User user = userRepository.findByEmail("customer1@laundromart.ke").orElseThrow();
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        mockMvc.perform(get("/api/users/" + user.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer1@laundromart.ke"));
    }

    @Test
    void nonAdminShouldBeForbiddenFromGettingUserById() throws Exception {
        User user = userRepository.findByEmail("customer1@laundromart.ke").orElseThrow();
        String token = jwtUtil.generateToken("customer1@laundromart.ke");

        mockMvc.perform(get("/api/users/" + user.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    // =========================
    // SELF-SERVICE: /me
    // =========================
    @Test
    void userShouldAccessOwnProfile() throws Exception {
        String token = jwtUtil.generateToken("customer1@laundromart.ke");

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer1@laundromart.ke"));
    }

    @Test
    void unauthenticatedUserCannotAccessMe() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    // =========================
    // CREATE USER - Admin only
    // =========================
    @Test
    void adminCanCreateUser() throws Exception {
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        String json = """
                {
                    "fullName": "Test Staff",
                    "email": "stafftest@example.com",
                    "phone": "+254700999888",
                    "passwordHash": "staff123",
                    "roleName": "STAFF"
                }
                """;

        mockMvc.perform(post("/api/users")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("stafftest@example.com"));
    }

    @Test
    void nonAdminCannotCreateUser() throws Exception {
        String token = jwtUtil.generateToken("customer1@laundromart.ke");

        String json = """
                {
                    "fullName": "Test Staff",
                    "email": "stafftest@example.com",
                    "passwordHash": "staff123",
                    "roleName": "STAFF"
                }
                """;

        mockMvc.perform(post("/api/users")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isForbidden());
    }

    // =========================
    // UPDATE USER - Admin only
    // =========================
    @Test
    void adminCanUpdateUser() throws Exception {
        User user = userRepository.findByEmail("customer1@laundromart.ke").orElseThrow();
        String token = jwtUtil.generateToken("admin@laundromart.ke");

        String json = """
                {
                    "fullName": "Customer Updated",
                    "email": "customer1@laundromart.ke",
                    "phone": "+254700111333"
                }
                """;

        mockMvc.perform(put("/api/users/" + user.getId())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Customer Updated"))
                .andExpect(jsonPath("$.phone").value("+254700111333"));
    }

    // =========================
    // DELETE USER - Admin only
    // =========================
    @Test
    void adminCanDeleteUser() throws Exception {
        User user = new User();
        user.setUsername("Delete Me");
        user.setEmail("delete@example.com");
        user.setPasswordHash("delete123");
        user = userRepository.save(user);

        String token = jwtUtil.generateToken("admin@laundromart.ke");

        mockMvc.perform(delete("/api/users/" + user.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
