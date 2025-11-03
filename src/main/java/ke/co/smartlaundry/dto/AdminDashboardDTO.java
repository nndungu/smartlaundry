package ke.co.smartlaundry.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalUsers;
    private long totalOrders;
    private long totalDrivers;
    private long totalCustomers;
    private long totalServices;
    private double totalEarnings;

    public AdminDashboardDTO(long totalUsers, long totalOrders, long totalDrivers, long totalCustomers, double totalEarnings) {
            this.totalUsers = totalUsers;
            this.totalOrders = totalOrders;
            this.totalDrivers = totalDrivers;
            this.totalCustomers = totalCustomers;
            this.totalEarnings = totalEarnings;
    }

    public AdminDashboardDTO(long totalUsers, long totalOrders, double totalEarnings) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalEarnings = totalEarnings;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(long totalDrivers) { this.totalDrivers = totalDrivers; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalServices() { return totalServices; }
    public void setTotalServices(long totalServices) { this.totalServices = totalServices; }

    public double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; }
}
