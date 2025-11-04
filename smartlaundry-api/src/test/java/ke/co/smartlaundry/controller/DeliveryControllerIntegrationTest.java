package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.DeliveryRequest;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.DeliveryRequestRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DeliveryControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private DeliveryRequestRepository deliveryRequestRepository;

    private User driver;
    private DeliveryRequest deliveryRequest;

    @BeforeEach
    void init() {
        driver = userRepository.findByEmail("driver1@example.com")
                .orElseThrow(() -> new IllegalStateException("Driver not found"));
        deliveryRequest = deliveryRequestRepository.findAllByDriverId(driver.getId()).get(0);
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void createDeliveryRequest_returnsDelivery() throws Exception {
        mockMvc.perform(post("/api/delivery/request/" + deliveryRequest.getOrder().getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(deliveryRequest.getOrder().getId()));
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void getPendingRequests_returnsArray() throws Exception {
        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUserId).thenReturn(driver.getId());

            mockMvc.perform(get("/api/delivery/pending"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray());
        }
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void acceptDeliveryRequest_updatesDriverId() throws Exception {
        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUserId).thenReturn(driver.getId());

            mockMvc.perform(post("/api/delivery/" + deliveryRequest.getId() + "/accept")
                            .param("driverId", driver.getId().toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.driverId").value(driver.getId()));
        }
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void declineDeliveryRequest_keepsPendingStatus() throws Exception {
        mockMvc.perform(post("/api/delivery/" + deliveryRequest.getId() + "/decline")
                        .param("driverId", driver.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void completeDeliveryRequest_updatesStatus() throws Exception {
        mockMvc.perform(post("/api/delivery/" + deliveryRequest.getId() + "/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }
}
