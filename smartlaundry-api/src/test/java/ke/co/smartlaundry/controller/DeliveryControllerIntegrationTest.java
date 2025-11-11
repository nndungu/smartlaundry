/*
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

import java.util.List;

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
        // Safely fetch driver
        driver = userRepository.findByEmail("driver1@smartlaundry.ke")
                .orElseThrow(() -> new IllegalStateException("Driver not found"));

        // Safely fetch a delivery request for this driver
        List<DeliveryRequest> requests = deliveryRequestRepository.findAllByDriverId(driver.getId());
        if (requests.isEmpty()) {
            throw new IllegalStateException("No delivery requests found for driver");
        }
        deliveryRequest = requests.get(0);
    }

    @Test
    @WithMockUser(username = "driver1@smartlaundry.ke", roles = {"DRIVER"})
    void createDeliveryRequest_returnsDelivery() throws Exception {
        mockMvc.perform(post("/api/delivery/request/" + deliveryRequest.getOrder().getId()))
                .andExpect(status().isOk())
                // JSON path matches the structure of DeliveryRequest
                .andExpect(jsonPath("$.order.id").value(deliveryRequest.getOrder().getId()));
    }

    @Test
    @WithMockUser(username = "driver1@smartlaundry.ke", roles = {"DRIVER"})
    void getPendingRequests_returnsArray() throws Exception {
        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUserId).thenReturn(driver.getId());

            mockMvc.perform(get("/api/delivery/pending"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray());
        }
    }

    @Test
    @WithMockUser(username = "driver1@smartlaundry.ke", roles = {"DRIVER"})
    void acceptDeliveryRequest_updatesDriverId() throws Exception {
        try (MockedStatic<SecurityUtils> security = mockStatic(SecurityUtils.class)) {
            security.when(SecurityUtils::getCurrentUserId).thenReturn(driver.getId());

            mockMvc.perform(post("/api/delivery/" + deliveryRequest.getId() + "/accept")
                            .param("driverId", driver.getId().toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.driver.id").value(driver.getId()));
        }
    }

    @Test
    @WithMockUser(username = "driver1@smartlaundry.ke", roles = {"DRIVER"})
    void declineDeliveryRequest_keepsPendingStatus() throws Exception {
        mockMvc.perform(post("/api/delivery/" + deliveryRequest.getId() + "/decline")
                        .param("driverId", driver.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @WithMockUser(username = "driver1@smartlaundry.ke", roles = {"DRIVER"})
    void completeDeliveryRequest_updatesStatus() throws Exception {
        mockMvc.perform(post("/api/delivery/" + deliveryRequest.getId() + "/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }
}
*/
