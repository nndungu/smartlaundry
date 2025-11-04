package ke.co.smartlaundry.controller;

import jakarta.transaction.Transactional;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UserControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;

    @BeforeEach
    void initData() {
        // Ensure roles exist
        createRoleIfMissing("ADMIN");
        createRoleIfMissing("CUSTOMER");
        createRoleIfMissing("DRIVER");

        // Ensure test users exist
        createTestUser("admin@example.com", "Admin", "Admin@123", "ADMIN");
        createTestUser("customer1@example.com", "Customer One", "Customer@123", "CUSTOMER");
        createTestUser("driver1@example.com", "Driver One", "Driver@123", "DRIVER");
    }

    private void createRoleIfMissing(String roleName) {
        roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = new Role();
            role.setName(roleName);
            return roleRepository.save(role);
        });
    }

    private void createTestUser(String email, String username, String password, String roleName) {
        userRepository.findByEmail(email).orElseGet(() -> {
            Role role = roleRepository.findByName(roleName).orElseThrow();
            User user = new User();
            user.setEmail(email);
            user.setUsername(username);
            user.setPasswordHash(password); // raw for simplicity; encode in service
            user.setStatus(User.Status.ACTIVE);
            user.setRole(role);
            return userRepository.save(user);
        });
    }

    // ==========================
    // Admin Tests
    // ==========================

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void adminCanAccessAllEndpoints() throws Exception {
        // Get all users
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // Create a new customer
        String json = """
                {
                    "username": "New Customer",
                    "email": "newcustomer@example.com",
                    "password": "Cust@123",
                    "role": "CUSTOMER"
                }
                """;
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("newcustomer@example.com"))
                .andExpect(jsonPath("$.user.username").value("New Customer"));
    }

    // ==========================
    // Customer Tests
    // ==========================

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void customerSelfServiceEndpoints() throws Exception {
        // Get profile
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer1@example.com"));

        // Update profile
        String updateJson = """
                {
                    "username": "Updated Customer",
                    "phoneNumber": "0712345678"
                }
                """;
        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("Updated Customer"));

        // Change password
        mockMvc.perform(post("/api/users/me/change-password")
                        .param("oldPassword", "Customer@123")
                        .param("newPassword", "NewPassword@123"))
                .andExpect(status().isOk());

        // Change email
        mockMvc.perform(post("/api/users/me/change-email")
                        .param("newEmail", "updatedcustomer@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("updatedcustomer@example.com"));
    }

    // ==========================
    // Driver Tests
    // ==========================

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void driverSelfServiceEndpoints() throws Exception {
        // Get profile
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("driver1@example.com"));

        // Update profile
        String updateJson = """
                {
                    "username": "Updated Driver",
                    "phoneNumber": "0722000111"
                }
                """;
        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("Updated Driver"));

        // Change password
        mockMvc.perform(post("/api/users/me/change-password")
                        .param("oldPassword", "Driver@123")
                        .param("newPassword", "Driver@1234"))
                .andExpect(status().isOk());

        // Change email
        mockMvc.perform(post("/api/users/me/change-email")
                        .param("newEmail", "driverupdated@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("driverupdated@example.com"));
    }

    // ==========================
    // Order & Cart Tests
    // ==========================

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void customerCanViewCartAndOrders() throws Exception {
        // Get cart items
        mockMvc.perform(get("/api/carts/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray());

        // Get orders
        mockMvc.perform(get("/api/orders/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].order_no").value("ORD-2025-0001"));
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void driverCanViewDeliveryRequests() throws Exception {
        mockMvc.perform(get("/api/deliveries/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    // ==========================
    // Admin can delete users
    // ==========================
    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void adminCanDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/users/2")) // delete driver1
                .andExpect(status().isNoContent());
    }
}
