package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

class AdminControllerUnitTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private User adminUser;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

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
    @DisplayName("Admin can get profile")
    void adminCanGetProfile() {
        AdminDTO adminDTO = new AdminDTO(
                adminUser.getId(),
                adminUser.getUsername(),
                adminUser.getEmail(),
                adminUser.getPhoneNumber(),
                adminRole.getName()
        );

        when(adminService.getAdminProfile(adminUser.getId())).thenReturn(adminDTO);

        AdminDTO result = adminController.getProfile(adminUser.getId()).getBody();

        assertNotNull(result);
        assertEquals("admin@smartlaundry.ke", result.getEmail());
        assertEquals("ADMIN", result.getRole());
    }

    @Test
    @DisplayName("Admin can view dashboard metrics")
    void adminCanViewDashboard() {
        AdminDashboardDTO dashboardDTO = new AdminDashboardDTO(3, 1, 1500.0);
        when(adminService.getDashboardMetrics()).thenReturn(dashboardDTO);

        AdminDashboardDTO result = adminController.getDashboard();

        assertNotNull(result);
        assertEquals(3, result.getTotalUsers());
        assertEquals(1, result.getTotalOrders());
        assertEquals(1500.0, result.getTotalEarnings());
    }

    @Test
    @DisplayName("Admin can list customers and drivers")
    void adminCanListUsers() {
        CustomerDTO customerDTO = new CustomerDTO(5L, "John Mwangi", "customer1@smartlaundry.ke", "0711000004", true);
        DriverDTO driverDTO = new DriverDTO(4L, "Driver One", "driver1@smartlaundry.ke", "0711000003");

        when(adminService.getAllCustomers()).thenReturn(List.of(customerDTO));
        when(adminService.getAllDrivers()).thenReturn(List.of(driverDTO));

        List<CustomerDTO> customers = adminController.listCustomers().getBody();
        List<DriverDTO> drivers = adminController.listDrivers().getBody();

        assertEquals(1, customers.size());
        assertEquals("customer1@smartlaundry.ke", customers.get(0).getEmail());

        assertEquals(1, drivers.size());
        assertEquals("driver1@smartlaundry.ke", drivers.get(0).getEmail());
    }

    @Test
    @DisplayName("Admin can suspend and activate users")
    void adminCanSuspendAndActivateUsers() {
        doNothing().when(adminService).suspendUser(5L);
        doNothing().when(adminService).activateUser(5L);

        String suspendMsg = String.valueOf(adminController.suspendUser(5L));
        String activateMsg = String.valueOf(adminController.activateUser(5L));

        assertEquals("User suspended successfully", suspendMsg);
        assertEquals("User activated successfully", activateMsg);
    }

    @Test
    @DisplayName("Admin can manage services, categories, and pricing")
    void adminCanManageServicesCategoriesPricing() {
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

        List<ServiceTypeDTO> services = adminController.listServices().getBody();
        ServiceTypeDTO createdService = adminController.createService(serviceDTO).getBody();

        assertNotNull(services);
        assertEquals("Wash & Fold", services.get(0).getName());
        assertNotNull(createdService);
        assertEquals("Wash & Fold", createdService.getName());

        List<CategoryDTO> categories = adminController.listCategories().getBody();
        CategoryDTO createdCategory = adminController.createCategory(categoryDTO).getBody();

        assertNotNull(categories);
        assertEquals("Shirt", categories.getFirst().getName());
        assertNotNull(createdCategory);
        assertEquals("Shirt", createdCategory.getName());

        List<PriceListDTO> prices = adminController.listPrices().getBody();
        PriceListDTO createdPrice = adminController.createPrice(priceDTO).getBody();

        assertNotNull(prices);
        assertEquals(150.0, prices.get(0).getUnitPrice());
        assertNotNull(createdPrice);
        assertEquals(150.0, createdPrice.getUnitPrice());

        assertDoesNotThrow(() -> adminController.deletePrice(1L));
    }

    @Test
    @DisplayName("Admin can view driver earnings and performance")
    void adminCanViewDriverStats() {
        EarningsDTO earningsDTO = new EarningsDTO(1L, 4L, 550.0, "DELIVERY", null);
        DriverPerformanceDTO perfDTO = new DriverPerformanceDTO(4L, "Driver One", 1, 1, 550.0, 550.0);

        when(adminService.getEarningsForDriver(4L)).thenReturn(List.of(earningsDTO));
        when(adminService.getDriverPerformance(4L)).thenReturn(perfDTO);

        List<EarningsDTO> earnings = adminController.getDriverEarnings(4L).getBody();
        DriverPerformanceDTO performance = adminController.getDriverPerformance(4L).getBody();

        assertNotNull(earnings);
        assertEquals(550.0, earnings.get(0).getAmount());
        assertNotNull(performance);
        assertEquals(4, performance.getDriverId());
        assertEquals(1, performance.getCompletedOrders());
        assertEquals(550.0, performance.getTotalEarnings());
    }
}
