package ke.co.smartlaundry.dto;

import lombok.Data;

@Data
public class DriverPerformanceDTO {
    private String username;
    private int totalOrdersDelivered;
    private double completedOrders;
    private double totalEarnings;
    private double averageRating;

    public DriverPerformanceDTO() { }

    public DriverPerformanceDTO(Long driverId, String username, double totalOrders, double completedOrders, double totalEarnings, double averageRating) {
    }

    public int getTotalOrderDelivered() { return  totalOrdersDelivered; }
    public void setTotalOrdersDelivered(double totalEarnings ) { this.totalEarnings = totalEarnings; }

    public int getDriverId() {
        return 0;
    }


}
