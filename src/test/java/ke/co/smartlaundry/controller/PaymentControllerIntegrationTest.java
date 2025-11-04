package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.dto.PaymentRequestDTO;
import ke.co.smartlaundry.model.User;
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
@ActiveProfiles("test")
class PaymentControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;

    private Long customerId;

    @BeforeEach
    void init() {
        // Load user from SQL-seeded data
        User customer = userRepository.findByEmail("customer1@example.com").orElseThrow();
        customerId = customer.getId();
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void testInitiatePayment() throws Exception {
        PaymentRequestDTO request = new PaymentRequestDTO();
        request.setOrderId(1L);
        request.setAmount(1150.0);

        mockMvc.perform(post("/api/payments/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.amount").value(1150.0));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void testGetPaymentsByOrder() throws Exception {
        mockMvc.perform(get("/api/payments/order/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].orderId").value(1));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void testGetPaymentByTransactionRef() throws Exception {
        String transactionRef = "TXN-1150"; // adjust to match seeded data if needed
        mockMvc.perform(get("/api/payments/transaction/" + transactionRef))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionRef").value(transactionRef));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void testHandleMpesaCallback() throws Exception {
        String callbackBody = "{ \"transactionId\": \"TXN-1150\", \"status\": \"SUCCESS\" }";

        mockMvc.perform(post("/api/payments/callback/mpesa")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(callbackBody))
                .andExpect(status().isOk())
                .andExpect(content().string("Callback received successfully"));
    }

    @Test
    @WithMockUser(username = "customer1@example.com", roles = {"CUSTOMER"})
    void testRefundPayment() throws Exception {
        mockMvc.perform(post("/api/payments/refund/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Refund initiated (if supported)"));
    }
}
