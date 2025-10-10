package ke.co.smartlaundry.dto;

import java.time.LocalDateTime;

public class CreateOrderRequestDTO {
    public Long customerId;
    public Long branchId;
    public Long driverId; // optional
    public LocalDateTime scheduledPickup;
    public LocalDateTime scheduledDelivery;
}