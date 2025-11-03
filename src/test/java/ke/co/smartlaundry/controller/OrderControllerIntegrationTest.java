package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.configuration.MockMpesaConfig;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.OrderRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(MockMpesaConfig.class)
@ActiveProfiles("test")
@Transactional
class OrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setup() {
        testUser = userRepository.findByEmail("customer1@example.com")
                .orElseThrow(() -> new IllegalStateException("Test user not found in test-data.sql"));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    @DisplayName("GET /api/orders should return user's orders")
    void getUserOrders_shouldReturnList() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUser.getId());

            var result = mockMvc.perform(get("/api/orders"))
                    .andExpect(status().isOk())
                    .andReturn();

            String json = result.getResponse().getContentAsString();
            System.out.println("✅ Response JSON: " + json);

            assertThat(json).contains("status"); // ensure something returned
        }
    }

    @Test
    @DisplayName("GET /api/orders/{id} should return specific order")
    void getOrderById_shouldReturnOrder() throws Exception {
        Order order = orderRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No order found in DB"));

        mockMvc.perform(get("/api/orders/{id}", order.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(order.getId()))
                .andExpect(jsonPath("$.status").value(order.getStatus().name()));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    @DisplayName("POST /api/orders/checkout should create a new order")
    void checkout_shouldCreateOrder() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUser.getId());

            long before = orderRepository.count();

            mockMvc.perform(post("/api/orders/checkout")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").exists())
                    .andExpect(jsonPath("$.status").value("PENDING"));

            long after = orderRepository.count();
            assertThat(after).isGreaterThan(before);
        }
    }

    @Test
    @DisplayName("PATCH /api/orders/{id}/status should update order status")
    void updateOrderStatus_shouldUpdate() throws Exception {
        Order order = orderRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No order found"));

        mockMvc.perform(patch("/api/orders/{id}/status", order.getId())
                        .param("status", "PAID"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));

        Order updated = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(OrderStatus.PAID);
    }

    @Test
    @DisplayName("DELETE /api/orders/{id} should remove order")
    void deleteOrder_shouldRemove() throws Exception {
        Order order = orderRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No order found"));

        mockMvc.perform(delete("/api/orders/{id}", order.getId()))
                .andExpect(status().isNoContent());

        assertThat(orderRepository.findById(order.getId())).isEmpty();
    }
}
