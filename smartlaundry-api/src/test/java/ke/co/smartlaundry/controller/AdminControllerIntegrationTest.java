/*
package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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
@WithMockUser(username = "admin@smartlaundry.ke", roles = "ADMIN")
class AdminControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean
    private AdminService adminService;

    private User adminUser;
    private Role adminRole;

    @BeforeEach
    void init() {
        adminRole = new Role();
        adminRole.setId(1L);
        adminRole.setName("ADMIN");

        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@smartlaundry.ke");
        adminUser.setUsername("Admin User");
        adminUser.setPhoneNumber("0711000111");
        adminUser.setRole(adminRole);
    }

    @Test
    @DisplayName("Admin can view profile")
    void adminCanGetProfile() throws Exception {
        when(adminService.getAdminProfile(adminUser.getId()))
                .thenReturn(new AdminDTO(
                        adminUser.getId(),
                        adminUser.getUsername(),
                        adminUser.getEmail(),
                        adminUser.getPhoneNumber(),
                        adminRole.getName()
                ));

        mockMvc.perform(get("/api/admin/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(adminUser.getEmail()))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    @DisplayName("Admin can view dashboard metrics")
    void adminCanViewDashboard() throws Exception {
        AdminDashboardDTO dashboardDTO = new AdminDashboardDTO(3, 1, 1500.0);
        when(adminService.getDashboardMetrics()).thenReturn(dashboardDTO);

        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(3))
                .andExpect(jsonPath("$.totalOrders").value(1))
                .andExpect(jsonPath("$.totalEarnings").value(1500.0));
    }

    @Test
    @DisplayName("Admin can list customers and drivers")
    void adminCanListUsers() throws Exception {
        CustomerDTO customerDTO = new CustomerDTO(5L, "John Mwangi", "customer1@smartlaundry.ke", "0711000004", true);
        DriverDTO driverDTO = new DriverDTO(4L, "Driver One", "driver1@smartlaundry.ke", "0711000003");

        when(adminService.getAllCustomers()).thenReturn(List.of(customerDTO));
        when(adminService.getAllDrivers()).thenReturn(List.of(driverDTO));

        mockMvc.perform(get("/api/admin/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("customer1@smartlaundry.ke"));

        mockMvc.perform(get("/api/admin/drivers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("driver1@smartlaundry.ke"));
    }

    @Test
    @DisplayName("Admin can suspend and activate users")
    void adminCanSuspendAndActivateUsers() throws Exception {
        doNothing().when(adminService).suspendUser(5L);
        doNothing().when(adminService).activateUser(5L);

        mockMvc.perform(post("/api/admin/user/5/suspend"))
                .andExpect(status().isOk())
                .andExpect(content().string("User suspended successfully"));

        mockMvc.perform(post("/api/admin/user/5/activate"))
                .andExpect(status().isOk())
                .andExpect(content().string("User activated successfully"));
    }

    @Test
    @DisplayName("Admin can manage services, categories, and pricing")
    void adminCanManageServicesCategoriesPricing() throws Exception {
        ServiceTypeDTO serviceDTO = new ServiceTypeDTO(1L, "WASH_FOLD", "Wash & Fold", "Basic wash", 150.0);
        CategoryDTO categoryDTO = new CategoryDTO(1L, "Shirt", "All shirts");
        PriceListDTO priceDTO = new PriceListDTO(1L, 1L, 1L, "Wash & Fold", "Shirt", 150.0);

        when(adminService.listServiceTypes()).thenReturn(List.of(serviceDTO));
        when(adminService.createServiceType(any())).thenReturn(serviceDTO);

        when(adminService.listCategories()).thenReturn(List.of(categoryDTO));
        when(adminService.createCategory(any())).thenReturn(categoryDTO);

        when(adminService.listPriceLists()).thenReturn(List.of(priceDTO));
        when(adminService.createPriceList(any())).thenReturn(priceDTO);
        doNothing().when(adminService).deletePriceList(1L);

        mockMvc.perform(get("/api/admin/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Wash & Fold"));

        mockMvc.perform(post("/api/admin/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(serviceDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Wash & Fold"));

        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Shirt"));

        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Shirt"));

        mockMvc.perform(get("/api/admin/prices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].unitPrice").value(150.0));

        mockMvc.perform(post("/api/admin/prices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(priceDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unitPrice").value(150.0));

        mockMvc.perform(delete("/api/admin/prices/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Admin can view driver earnings and performance")
    void adminCanViewDriverStats() throws Exception {
        EarningsDTO earningsDTO = new EarningsDTO(1L, 4L, 550.0, "DELIVERY", null);
        DriverPerformanceDTO perfDTO = new DriverPerformanceDTO(4L, "Driver One", 1, 1, 550.0, 550.0);

        when(adminService.getEarningsForDriver(4L)).thenReturn(List.of(earningsDTO));
        when(adminService.getDriverPerformance(4L)).thenReturn(perfDTO);

        mockMvc.perform(get("/api/admin/driver/4/earnings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].amount").value(550.0));

        mockMvc.perform(get("/api/admin/driver/4/performance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driverId").value(4))
                .andExpect(jsonPath("$.completedOrders").value(1))
                .andExpect(jsonPath("$.totalEarnings").value(550.0));
    }
}
*/
