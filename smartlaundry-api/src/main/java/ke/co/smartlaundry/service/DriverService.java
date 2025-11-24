package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;

import java.util.List;

public interface DriverService {

    // ---------------------------
    // Profile
    // ---------------------------
    DriverDTO getDriverProfile(Long driverId);

    // ---------------------------
    // Assigned Orders
    // ---------------------------
    List<OrderDTO> getAssignedOrders(Long driverId);

    // ---------------------------
    // Earnings & Performance
    // ---------------------------
    DriverEarningsDTO getEarnings(Long driverId);

    List<DriverEarningsDetailDTO> getEarningsHistory(Long driverId);

    RevenueReportDTO getDriverRevenue(Long driverId);

    // ---------------------------
    // Driver Notifications
    // ---------------------------
    List<NotificationDTO> getDriverNotifications(Long driverId);

    // ---------------------------
    // Performance
    // ---------------------------
    DriverPerformanceDTO getPerformance(Long driverId);

    // ---------------------------
    // Location
    // ---------------------------
    void updateLocation(Long driverId, double latitude, double longitude);
}
