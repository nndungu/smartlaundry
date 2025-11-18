package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ----------------------------
    // Profile
    // ----------------------------
    @GetMapping("/me")
    public ResponseEntity<AdminDTO> getProfile(Long id) {
        Long adminId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(adminService.getAdminProfile(adminId));
    }

    // ----------------------------
    // Dashboard / Analytics
    // ----------------------------
    public AdminDashboardDTO getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats()).getBody();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardMetrics() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/analytics")
    public ResponseEntity<ServiceAnalyticsDTO> getServiceAnalytics() {
        return ResponseEntity.ok(adminService.getServiceAnalytics());
    }

    // ----------------------------
    // User Management
    // ----------------------------
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> listCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<DriverDTO>> listDrivers() {
        return ResponseEntity.ok(adminService.getAllDrivers());
    }

    @PostMapping("/user/{id}/suspend")
    public ResponseEntity<String> suspendUser(@PathVariable Long id) {
        adminService.suspendUser(id);
        return ResponseEntity.ok("User suspended successfully");
    }

    @PostMapping("/user/{id}/activate")
    public ResponseEntity<String> activateUser(@PathVariable Long id) {
        adminService.activateUser(id);
        return ResponseEntity.ok("User activated successfully");
    }

    // ----------------------------
    // Services, Categories, Pricing
    // ----------------------------
    @GetMapping("/services")
    public ResponseEntity<List<ServiceTypeDTO>> listServices() {
        return ResponseEntity.ok(adminService.listServiceTypes());
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceTypeDTO> createService(@RequestBody ServiceTypeDTO dto) {
        return ResponseEntity.ok(adminService.createServiceType(dto));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> listCategories() {
        return ResponseEntity.ok(adminService.listCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(adminService.createCategory(dto));
    }

    @GetMapping("/prices")
    public ResponseEntity<List<PriceListDTO>> listPrices() {
        return ResponseEntity.ok(adminService.listPriceLists());
    }

    @PostMapping("/prices")
    public ResponseEntity<PriceListDTO> createPrice(@RequestBody PriceListDTO dto) {
        return ResponseEntity.ok(adminService.createPriceList(dto));
    }

    @DeleteMapping("/prices/{id}")
    public ResponseEntity<Void> deletePrice(@PathVariable Long id) {
        adminService.deletePriceList(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------------------
    // Driver Earnings / Performance
    // ----------------------------
    @GetMapping("/driver/{id}/earnings")
    public ResponseEntity<List<EarningsDTO>> getDriverEarnings(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getEarningsForDriver(id));
    }

    @GetMapping("/driver/{id}/performance")
    public ResponseEntity<DriverPerformanceDTO> getDriverPerformance(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getDriverPerformance(id));
    }

    // ----------------------------
    // Notifications
    // ----------------------------
    @PostMapping("/notifications")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequestDTO dto) {
        adminService.sendNotification(dto);
        return ResponseEntity.ok("Notification sent successfully");
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        return ResponseEntity.ok(adminService.getAllNotifications());
    }

    // ----------------------------
    // Revenue Reports
    // ----------------------------
    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDTO> getTotalRevenue() {
        return ResponseEntity.ok(adminService.getTotalRevenue());
    }

    @GetMapping("/revenue/{period}")
    public ResponseEntity<RevenueReportDTO> getRevenueByPeriod(@PathVariable String period) {
        return ResponseEntity.ok(adminService.getRevenueByPeriod(period));
    }

}
