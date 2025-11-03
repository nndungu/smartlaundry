package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.DriverLocation;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    // Profile
    @GetMapping("/me")
    public ResponseEntity<DriverDTO> getProfile() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getDriverProfile(driverId));
    }

    // Assigned Orders
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getAssignedOrders(driverId));
    }

    // Earnings
    @GetMapping("/earnings")
    public ResponseEntity<DriverEarningsDTO> getEarnings() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getEarnings(driverId));
    }

    @GetMapping("/earnings/history")
    public ResponseEntity<List<DriverEarningsDetailDTO>> getEarningsHistory() {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(driverService.getEarningsHistory(driverId));
    }

    // Update location
    @PostMapping("/location")
    public ResponseEntity<Void> updateLocation(@RequestBody DriverLocationDTO location) {
        Long driverId = SecurityUtils.getCurrentUserId();
        driverService.updateLocation(driverId, location.getLatitude(), location.getLongitude());
        return ResponseEntity.noContent().build();
    }

    @Query(value = """
        SELECT * FROM driver_location dl
        WHERE ST_DWithin(
            dl.location,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
            :radius
        )
        ORDER BY
            ST_Distance(
                dl.location,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
            )
        """, nativeQuery = true)
    List<DriverLocation> findDriversNear(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusMeters
    ) {
        return null;
    }
}
