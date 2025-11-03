package ke.co.smartlaundry.dto;

public class ServiceAnalyticsDTO {
    private long totalUsers;
    private long totalOrders;
    private long totalDrivers;
    private long totalCustomers;

    public ServiceAnalyticsDTO() {}
    public ServiceAnalyticsDTO(long totalUsers, long totalOrders, long totalDrivers, long totalCustomers) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalDrivers = totalDrivers;
        this.totalCustomers = totalCustomers;
    }

    public int getTotalUsers() { return Math.toIntExact(totalUsers); }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public int getTotalCustomers() { return Math.toIntExact(totalCustomers); }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public int getTotalOrders() { return Math.toIntExact(totalOrders); }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public int getTotalDrivers() { return Math.toIntExact(totalDrivers); }
    public void setTotalDrivers(long totalDrivers) { this.totalDrivers = totalDrivers; }
}
