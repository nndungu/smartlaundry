package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.security.JwtUtil;
import ke.co.smartlaundry.service.DriverService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DriverControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private DriverService driverService;
    @MockitoBean private JwtUtil jwtUtil;

    private User driverUser;
    private final String token = "dummy-token";

    @BeforeEach
    void setup() {
        driverUser = new User();
        driverUser.setId(3L);
        driverUser.setUsername("Driver One");
        driverUser.setEmail("driver1@smartlaundry.ke");
        driverUser.setPhoneNumber("0722000111");

        // Mock JWT extraction
        when(jwtUtil.extractUserId(token)).thenReturn(driverUser.getId());
        when(jwtUtil.extractEmail(token)).thenReturn(driverUser.getEmail());
        when(jwtUtil.extractRole(token)).thenReturn("DRIVER");
    }

    @Test
    @DisplayName("Driver can view profile")
    void driverCanViewProfile() throws Exception {
        DriverDTO dto = new DriverDTO(driverUser.getId(), driverUser.getUsername(), driverUser.getEmail(), driverUser.getPhoneNumber());
        when(driverService.getDriverProfile(driverUser.getId())).thenReturn(dto);

        mockMvc.perform(get("/api/driver/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(driverUser.getId()))
                .andExpect(jsonPath("$.username").value(driverUser.getUsername()))
                .andExpect(jsonPath("$.email").value(driverUser.getEmail()))
                .andExpect(jsonPath("$.phoneNumber").value(driverUser.getPhoneNumber()));
    }

    @Test
    @DisplayName("Driver can update location")
    void driverCanUpdateLocation() throws Exception {
        DriverLocationDTO location = new DriverLocationDTO(-1.2921, 36.8219);

        mockMvc.perform(post("/api/driver/location")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(location)))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Driver can view assigned orders")
    void driverCanViewAssignedOrders() throws Exception {
        OrderDTO order = new OrderDTO(101L, "PENDING", 150.0, null);
        when(driverService.getAssignedOrders(driverUser.getId())).thenReturn(List.of(order));

        mockMvc.perform(get("/api/driver/orders")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(101))
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[0].amount").value(150.0));
    }

    @Test
    @DisplayName("Driver can view earnings")
    void driverCanViewEarnings() throws Exception {
        DriverEarningsDTO earnings = new DriverEarningsDTO(driverUser.getId(), 5000.0);
        when(driverService.getEarnings(driverUser.getId())).thenReturn(earnings);

        mockMvc.perform(get("/api/driver/earnings")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driverId").value(driverUser.getId()))
                .andExpect(jsonPath("$.totalEarnings").value(5000.0));
    }

    @Test
    @DisplayName("Driver can view earnings history")
    void driverCanViewEarningsHistory() throws Exception {
        DriverEarningsDetailDTO detail = new DriverEarningsDetailDTO(1L, 101L, 500.0, "CREDIT", null);
        when(driverService.getEarningsHistory(driverUser.getId())).thenReturn(List.of(detail));

        mockMvc.perform(get("/api/driver/earnings/history")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].orderId").value(101))
                .andExpect(jsonPath("$[0].amount").value(500.0))
                .andExpect(jsonPath("$[0].type").value("CREDIT"));
    }

    @Test
    @DisplayName("Driver can view performance")
    void driverCanViewPerformance() throws Exception {
        DriverPerformanceDTO performance = new DriverPerformanceDTO(driverUser.getId(), driverUser.getUsername(),
                10, 8, 4000.0, 500.0);
        when(driverService.getPerformance(driverUser.getId())).thenReturn(performance);

        mockMvc.perform(get("/api/driver/performance")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driverId").value(driverUser.getId()))
                .andExpect(jsonPath("$.username").value(driverUser.getUsername()))
                .andExpect(jsonPath("$.totalOrders").value(10))
                .andExpect(jsonPath("$.completedOrders").value(8))
                .andExpect(jsonPath("$.totalEarnings").value(4000.0))
                .andExpect(jsonPath("$.pendingEarnings").value(500.0));
    }
}
