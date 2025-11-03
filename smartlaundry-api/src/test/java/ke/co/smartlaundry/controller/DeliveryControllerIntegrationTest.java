package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.DeliveryRequest;
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

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DeliveryControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;

    private Long driverId;

    @BeforeEach
    void init() {
        driverId = userRepository.findByEmail("driver1@example.com")
                .orElseThrow().getId();
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void testCreateDeliveryRequest() throws Exception {
        mockMvc.perform(post("/api/delivery/request/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1));
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void testGetPendingRequests() throws Exception {
        mockMvc.perform(get("/api/delivery/pending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void testAcceptDeliveryRequest() throws Exception {
        mockMvc.perform(post("/api/delivery/1/accept")
                        .param("driverId", driverId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driverId").value(driverId));
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void testDeclineDeliveryRequest() throws Exception {
        mockMvc.perform(post("/api/delivery/1/decline")
                        .param("driverId", driverId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING")); // still pending for others
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void testCompleteDeliveryRequest() throws Exception {
        mockMvc.perform(post("/api/delivery/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }
}
