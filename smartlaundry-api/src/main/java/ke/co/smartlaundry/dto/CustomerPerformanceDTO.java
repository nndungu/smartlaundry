package ke.co.smartlaundry.dto;

import lombok.Data;

@Data
public class CustomerPerformanceDTO {
    private int totalOrdersPlaced;
    private double totalSpent;
    private double averageOrderValue;
}
