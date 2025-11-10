package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ----------------------------
    // Services & pricing
    // ----------------------------
    @GetMapping("/services")
    public ResponseEntity<List<ServiceTypeDTO>> listServices() {
        return ResponseEntity.ok(customerService.listServiceTypeName());
    }

    @GetMapping("/available-services")
    public ResponseEntity<List<ServiceTypeDTO>> availableServices() {
        return ResponseEntity.ok(customerService.getAvailableServices());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> listCategories() {
        return ResponseEntity.ok(customerService.listCategories());
    }

    @GetMapping("/prices")
    public ResponseEntity<List<PriceListDTO>> listPrices() {
        return ResponseEntity.ok(customerService.getAvailablePrices());
    }

    @GetMapping("/prices/{serviceTypeId}")
    public ResponseEntity<List<PriceListDTO>> pricesFor(@PathVariable Long serviceTypeId) {
        return ResponseEntity.ok(customerService.getPriceListForService(serviceTypeId));
    }

    // ----------------------------
    // Profile & account
    // ----------------------------
    @GetMapping("/me")
    public ResponseEntity<CustomerDTO> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(customerService.getCustomerProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateProfile(@RequestBody CustomerDTO profileData) {
        Long userId = SecurityUtils.getCurrentUserId();
        customerService.updateProfile(userId, profileData);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteAccount() {
        Long userId = SecurityUtils.getCurrentUserId();
        customerService.deleteAccount(userId);
        return ResponseEntity.ok("Account deleted successfully");
    }

    // ----------------------------
    // Orders
    // ----------------------------
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        Long customerId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(customerService.getOrdersByCustomer(customerId));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody OrderRequestDTO request) {
        return ResponseEntity.ok(customerService.placeOrder(request));
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        customerService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

    // ----------------------------
    // Payments
    // ----------------------------
    @PostMapping("/pay")
    public ResponseEntity<PaymentDTO> pay(@RequestBody PaymentRequestDTO request,
                                          @RequestParam(defaultValue = "MPESA") String method) {
        return ResponseEntity.ok(customerService.makePayment(request, method));
    }

    // ----------------------------
    // Loyalty
    // ----------------------------
    @GetMapping("/loyalty")
    public ResponseEntity<LoyaltyLedgerDTO> loyaltyLedger() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(customerService.getLoyaltyLedger(userId));
    }

    @GetMapping("/loyalty/status")
    public ResponseEntity<LoyaltyStatusDTO> loyaltyStatus() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(customerService.getLoyaltyStatus(userId));
    }

    // ----------------------------
    // Driver tracking
    // ----------------------------
    @GetMapping("/driver/{driverId}/location")
    public ResponseEntity<DriverLocationDTO> getDriverLocation(@PathVariable Long driverId) {
        return ResponseEntity.ok(customerService.getDriverLocation(driverId));
    }

    // ----------------------------
    // Performance
    // ----------------------------
    @GetMapping("/performance")
    public ResponseEntity<CustomerPerformanceDTO> getPerformance() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(customerService.getPerformance(userId));
    }
}
