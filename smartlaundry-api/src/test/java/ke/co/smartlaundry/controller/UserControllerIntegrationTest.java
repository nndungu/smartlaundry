package ke.co.smartlaundry.controller;

import jakarta.transaction.Transactional;
import ke.co.smartlaundry.enums.DeliveryStatus;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.security.SecurityUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class UserControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;

    // ==========================
    // Admin Tests
    // ==========================
    @Test
    @WithMockUser(username = "admin@dev.smartlaundry", roles = {"ADMIN"})
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

    @Test
    @WithMockUser(username = "admin@dev.smartlaundry", roles = {"ADMIN"})
    void adminCanDeleteUser() throws Exception {
        User driver = userRepository.findByEmail("driver1@dev.smartlaundry").orElseThrow();
        mockMvc.perform(delete("/api/users/" + driver.getId()))
                .andExpect(status().isNoContent());
    }

    // ==========================
    // Customer Tests
    // ==========================
    @Test
    @WithMockUser(username = "customer1@dev.smartlaundry", roles = {"CUSTOMER"})
    void customerSelfServiceEndpoints() throws Exception {
        // Get profile
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer1@dev.smartlaundry"));

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

    @Test
    @WithMockUser(username = "customer1@dev.smartlaundry", roles = {"CUSTOMER"})
    @DisplayName("Customer can view cart and orders")
    void customerCanViewCartAndOrders() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(
                    userRepository.findByEmail("customer1@dev.smartlaundry").get().getId()
            );

            // --- Cart ---
            mockMvc.perform(get("/api/carts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2)) // matches V3__test_seed.sql
                    .andExpect(jsonPath("$[0].itemName").value("Shirt"))
                    .andExpect(jsonPath("$[1].itemName").value("Trouser"));

            // --- Orders ---
            mockMvc.perform(get("/api/orders"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").exists())
                    .andExpect(jsonPath("$[0].status").exists());
        }
    }

    // ==========================
    // Driver Tests
    // ==========================
    @Test
    @WithMockUser(username = "driver1@dev.smartlaundry", roles = {"DRIVER"})
    void driverSelfServiceEndpoints() throws Exception {
        // Get profile
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("driver1@dev.smartlaundry"));

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

    @Test
    @WithMockUser(username = "driver1@dev.smartlaundry", roles = {"DRIVER"})
    void driverCanViewDeliveryRequests() throws Exception {
        mockMvc.perform(get("/api/deliveries/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }
}
