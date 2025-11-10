package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.configuration.MockMpesaConfig;
import ke.co.smartlaundry.dto.CheckoutRequestDTO;
import ke.co.smartlaundry.dto.OrderItemRequestDTO;
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

import java.util.Arrays;
import java.util.List;

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

    @Autowired private MockMvc mockMvc;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ObjectMapper objectMapper;

    private User testUser;
    private Long testUserId;

    @BeforeEach
    void setup() {
        testUser = userRepository.findByEmail("customer1@example.com")
                .orElseThrow(() -> new IllegalStateException("Test user not found"));
        testUserId = testUser.getId();
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    @DisplayName("GET /api/orders should return user's orders dynamically")
    void getUserOrders_shouldReturnList() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            List<Order> userOrders = orderRepository.findByUserId(testUserId);

            mockMvc.perform(get("/api/orders"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(userOrders.size()))
                    .andExpect(result -> {
                        String json = result.getResponse().getContentAsString();
                        for (Order order : userOrders) {
                            assertThat(json).contains(order.getOrderNo());
                            assertThat(json).contains(order.getStatus().name());
                        }
                    });
        }
    }

    @Test
    @DisplayName("GET /api/orders/{id} returns specific order")
    void getOrderById_shouldReturnOrder() throws Exception {
        Order order = orderRepository.findAll().get(0);

        mockMvc.perform(get("/api/orders/{id}", order.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(order.getId()))
                .andExpect(jsonPath("$.status").value(order.getStatus().name()));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    @DisplayName("POST /api/orders/checkout creates new order dynamically")
    void checkout_shouldCreateOrder() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            long before = orderRepository.count();

            // Create checkout request DTO
            OrderItemRequestDTO item1 = new OrderItemRequestDTO();
            item1.setItemName("Shirt");
            item1.setQuantity(2);
            item1.setPrice(500);

            OrderItemRequestDTO item2 = new OrderItemRequestDTO();
            item2.setItemName("Pants");
            item2.setQuantity(1);
            item2.setPrice(700);

            CheckoutRequestDTO checkoutRequest = new CheckoutRequestDTO();
            checkoutRequest.setServiceType("Laundry");
            checkoutRequest.setItems(Arrays.asList(item1, item2));

            mockMvc.perform(post("/api/orders/checkout")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(checkoutRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").exists())
                    .andExpect(jsonPath("$.status").value("PENDING"))
                    .andExpect(jsonPath("$.totalPrice").value(1700.0));

            long after = orderRepository.count();
            assertThat(after).isGreaterThan(before);
        }
    }

    @Test
    @DisplayName("PATCH /api/orders/{id}/status updates order status dynamically")
    void updateOrderStatus_shouldUpdate() throws Exception {
        Order order = orderRepository.findAll().get(0);

        mockMvc.perform(patch("/api/orders/{id}/status", order.getId())
                        .param("status", "PAID"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));

        Order updated = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(OrderStatus.PAID);
    }

    @Test
    @DisplayName("DELETE /api/orders/{id} removes order dynamically")
    void deleteOrder_shouldRemove() throws Exception {
        Order order = orderRepository.findAll().get(0);

        mockMvc.perform(delete("/api/orders/{id}", order.getId()))
                .andExpect(status().isNoContent());

        assertThat(orderRepository.findById(order.getId())).isEmpty();
    }
}
