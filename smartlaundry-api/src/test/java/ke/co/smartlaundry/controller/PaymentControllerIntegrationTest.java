package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.PaymentRequestDTO;
import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.OrderRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
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
@ActiveProfiles("test")
class PaymentControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;

    private User testCustomer;
    private Order testOrder;

    @BeforeEach
    void init() {
        testCustomer = userRepository.findByEmail("customer1@example.com")
                .orElseThrow(() -> new IllegalStateException("Test customer not found"));
        testOrder = orderRepository.findAllByUserId(testCustomer.getId()).get(0);
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void initiatePayment_createsPayment() throws Exception {
        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUserId).thenReturn(testCustomer.getId());

            PaymentRequestDTO request = new PaymentRequestDTO();
            request.setOrderId(testOrder.getId());
            request.setAmount(testOrder.getTotalPrice());

            mockMvc.perform(post("/api/payments/initiate")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.orderId").value(testOrder.getId()))
                    .andExpect(jsonPath("$.amount").value(testOrder.getTotalPrice()));
        }
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void getPaymentsByOrder_returnsPayments() throws Exception {
        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUserId).thenReturn(testCustomer.getId());

            mockMvc.perform(get("/api/payments/order/" + testOrder.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$[0].orderId").value(testOrder.getId()));
        }
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void handleMpesaCallback_works() throws Exception {
        String callbackJson = """
                {
                    "transactionId": "TXN-%d",
                    "status": "SUCCESS"
                }
                """.formatted(testOrder.getId());

        mockMvc.perform(post("/api/payments/callback/mpesa")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(callbackJson))
                .andExpect(status().isOk())
                .andExpect(content().string("Callback received successfully"));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void refundPayment_returnsSuccessMessage() throws Exception {
        mockMvc.perform(post("/api/payments/refund/" + testOrder.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Refund initiated (if supported)"));
    }
}
