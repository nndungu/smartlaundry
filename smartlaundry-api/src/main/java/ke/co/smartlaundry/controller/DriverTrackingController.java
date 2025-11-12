package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.DriverLocationDTO;
import ke.co.smartlaundry.service.DriverTrackingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver-tracking")
public class DriverTrackingController {

    private final DriverTrackingService trackingService;

    public DriverTrackingController(DriverTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping("/update")
    public void updateLocation(@RequestBody DriverLocationDTO dto) {
        trackingService.updateDriverLocation(dto.getDriverId(), dto.getLatitude(), dto.getLongitude());
    }

    @GetMapping("/{driverId}")
    public DriverLocationDTO getLocation(@PathVariable Long driverId) {
        return trackingService.getDriverLocation(driverId);
    }
}
