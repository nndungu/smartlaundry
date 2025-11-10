package ke.co.smartlaundry.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverEarningsDetailDTO {
    private Long orderId;
    private Long serviceTypeId;
    private double amount;
    private LocalDateTime date;

    public DriverEarningsDetailDTO(Long orderId, Long serviceTypeId, double amount, String credit, LocalDateTime date) {
        this.orderId = orderId;
        this.serviceTypeId = serviceTypeId;
        this.amount = amount;
        this.date = date;
    }
}
