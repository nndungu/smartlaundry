/*
package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "customer1@smartlaundry.ke", roles = "CUSTOMER")
class CustomerControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean
    private CustomerService customerService;

    @Autowired
    private UserRepository userRepository;

    private User seededCustomer;
    private Long seededCustomerId;

    @BeforeEach
    void setup() {
        // Load the seeded user from DB (from the SQL you provided)
        seededCustomer = userRepository.findByEmail("customer1@smartlaundry.ke")
                .orElseThrow(() -> new IllegalStateException("Seeded customer not found; ensure seed SQL ran"));
        seededCustomerId = seededCustomer.getId();
    }

    @Test
    @DisplayName("Customer can view profile (uses seeded user)")
    void customerCanViewProfile() throws Exception {
        CustomerDTO dto = new CustomerDTO(seededCustomerId, seededCustomer.getUsername(),
                seededCustomer.getEmail(), seededCustomer.getPhoneNumber(), true);

        // Stub service
        when(customerService.getCustomerProfile(seededCustomerId)).thenReturn(dto);

        // SecurityUtils.getCurrentUserId() used by controller — stub it to return seeded id
        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(get("/api/customer/me"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value(seededCustomer.getEmail()))
                    .andExpect(jsonPath("$.username").value(seededCustomer.getUsername()))
                    .andExpect(jsonPath("$.verified").value(true));
        }
    }

    @Test
    @DisplayName("Customer can update profile")
    void customerCanUpdateProfile() throws Exception {
        CustomerDTO update = new CustomerDTO();
        update.setUsername("Updated Name");
        update.setPhoneNumber("0712345678");

        doNothing().when(customerService).updateProfile(seededCustomerId, update);

        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(put("/api/customer/me")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(update)))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Profile updated successfully"));
        }
    }

    @Test
    @DisplayName("Customer can view orders")
    void customerCanViewOrders() throws Exception {
        OrderDTO order = new OrderDTO(1L, "PENDING", 500.0, null);
        when(customerService.getOrdersByCustomer(seededCustomerId)).thenReturn(List.of(order));

        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(get("/api/customer/orders"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].status").value("PENDING"))
                    .andExpect(jsonPath("$[0].amount").value(500.0));
        }
    }

    @Test
    @DisplayName("Customer can place order")
    void customerCanPlaceOrder() throws Exception {
        OrderRequestDTO request = new OrderRequestDTO();
        request.setServiceTypeId(1L);

        OrderDTO response = new OrderDTO(10L, "PENDING", 600.0, null);
        when(customerService.placeOrder(any(OrderRequestDTO.class))).thenReturn(response);

        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(post("/api/customer/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(10))
                    .andExpect(jsonPath("$.status").value("PENDING"))
                    .andExpect(jsonPath("$.amount").value(600.0));
        }
    }

    @Test
    @DisplayName("Customer can cancel order")
    void customerCanCancelOrder() throws Exception {
        doNothing().when(customerService).cancelOrder(1L);

        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(delete("/api/customer/orders/1"))
                    .andExpect(status().isNoContent());
        }
    }

    @Test
    @DisplayName("Customer can view loyalty status")
    void customerCanViewLoyalty() throws Exception {
        LoyaltyStatusDTO status = new LoyaltyStatusDTO("Bronze", 50);
        when(customerService.getLoyaltyStatus(seededCustomerId)).thenReturn(status);

        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(get("/api/customer/loyalty/status"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.tierName").value("Bronze"))
                    .andExpect(jsonPath("$.points").value(50));
        }
    }

    @Test
    @DisplayName("Customer can view loyalty ledger")
    void customerCanViewLoyaltyLedger() throws Exception {
        LoyaltyLedgerDTO ledger = new LoyaltyLedgerDTO(seededCustomerId, 100, List.of());
        when(customerService.getLoyaltyLedger(seededCustomerId)).thenReturn(ledger);

        try (MockedStatic<SecurityUtils> sec = Mockito.mockStatic(SecurityUtils.class)) {
            sec.when(SecurityUtils::getCurrentUserId).thenReturn(seededCustomerId);

            mockMvc.perform(get("/api/customer/loyalty"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.customerId").value(seededCustomerId.intValue()))
                    .andExpect(jsonPath("$.points").value(100))
                    .andExpect(jsonPath("$.transactions").isArray());
        }
    }
}
*/
