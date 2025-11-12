package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.DriverEarningsDTO;
import ke.co.smartlaundry.dto.DriverEarningsDetailDTO;
import ke.co.smartlaundry.dto.EarningsDTO;
import ke.co.smartlaundry.service.DriverEarningsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers/earnings")
public class DriverEarningsController {

    private final DriverEarningsService driverEarningsService;

    public DriverEarningsController(DriverEarningsService driverEarningsService) {
        this.driverEarningsService = driverEarningsService;
    }

    @GetMapping("/{driverId}/total")
    public ResponseEntity<DriverEarningsDTO> getTotalEarnings(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverEarningsService.getTotalEarnings(driverId));
    }

    @GetMapping("/{driverId}/history")
    public ResponseEntity<List<DriverEarningsDetailDTO>> getEarningsHistory(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverEarningsService.getEarningsHistory(driverId));
    }

    @PostMapping("/{driverId}/record")
    public ResponseEntity<EarningsDTO> recordEarning(
            @PathVariable Long driverId,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) Long serviceTypeId,
            @RequestParam double amount,
            @RequestParam String transactionType
    ) {
        return ResponseEntity.ok(driverEarningsService.recordEarning(driverId, orderId, serviceTypeId, amount, transactionType));
    }
}
