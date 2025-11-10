package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@PreAuthorize("hasRole('DRIVER')")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // ----------------------------
    // Profile
    // ----------------------------
    @GetMapping("/me")
    public ResponseEntity<DriverDTO> getProfile() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getDriverProfile(driverId));
    }

    // ----------------------------
    // Assigned Orders
    // ----------------------------
    @GetMapping("/me/orders")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getAssignedOrders(driverId));
    }

    // ----------------------------
    // Earnings & Performance
    // ----------------------------
    @GetMapping("/me/earnings")
    public ResponseEntity<DriverEarningsDTO> getEarnings() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getEarnings(driverId));
    }

    @GetMapping("/me/earnings-history")
    public ResponseEntity<List<DriverEarningsDetailDTO>> getEarningsHistory() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getEarningsHistory(driverId));
    }

    @GetMapping("/me/performance")
    public ResponseEntity<DriverPerformanceDTO> performance() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getPerformance(driverId));
    }

    // ----------------------------
    // Update Location
    // ----------------------------
    @PutMapping("/me/location")
    public ResponseEntity<String> updateLocation(@RequestParam double latitude,
                                                 @RequestParam double longitude) {
        Long driverId = SecurityUtils.getCurrentUserId();
        driverService.updateLocation(driverId, latitude, longitude);
        return ResponseEntity.ok("Location updated successfully");
    }
}
