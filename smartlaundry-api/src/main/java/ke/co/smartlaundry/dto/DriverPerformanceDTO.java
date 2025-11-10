package ke.co.smartlaundry.dto;

import lombok.Data;

@Data
public class DriverPerformanceDTO {
    private int totalOrdersDelivered;
    private double totalEarnings;
    private double averageRating;

    public DriverPerformanceDTO() { }

    public DriverPerformanceDTO(Long driverId, String username, long totalOrders, long completedOrders, double totalEarnings, double avgEarnings) {
    }

    public int getTotalOrderDelivered() { return  totalOrdersDelivered; }
    public void setTotalOrdersDelivered(double totalEarnings ) { this.totalEarnings = totalEarnings; }
}
