package ke.co.smartlaundry.dto;

import java.time.LocalDateTime;

public class CreateOrderRequestDTO {
    private Long customerId;
    private Long branchId;
    private Long driverId; // optional
    private LocalDateTime scheduledPickup;
    private LocalDateTime scheduledDelivery;

    public CreateOrderRequestDTO() {}

    public CreateOrderRequestDTO(Long customerId, Long branchId, Long driverId,
                                 LocalDateTime scheduledPickup, LocalDateTime scheduledDelivery) {
        this.customerId = customerId;
        this.branchId = branchId;
        this.driverId = driverId;
        this.scheduledPickup = scheduledPickup;
        this.scheduledDelivery = scheduledDelivery;
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public LocalDateTime getScheduledPickup() { return scheduledPickup; }
    public void setScheduledPickup(LocalDateTime scheduledPickup) { this.scheduledPickup = scheduledPickup; }

    public LocalDateTime getScheduledDelivery() { return scheduledDelivery; }
    public void setScheduledDelivery(LocalDateTime scheduledDelivery) { this.scheduledDelivery = scheduledDelivery; }
}
