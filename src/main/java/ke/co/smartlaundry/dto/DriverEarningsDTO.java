package ke.co.smartlaundry.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverEarningsDTO {
    private Long driverId;
    private double totalEarnings;
}
