package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;

import java.util.List;

public interface AdminService {

    // Profile
    AdminDTO getAdminProfile(Long adminId);
    AdminDTO getAdminProfileByEmail(String email);

    // Dashboard
    AdminDashboardDTO getDashboardMetrics();
    AdminDashboardDTO getDashboardStats();

    // Analytics
    ServiceAnalyticsDTO getServiceAnalytics();

    // Services
    void addServiceType(ServiceTypeDTO dto);
    void deleteServiceType(Long id);
    List<ServiceTypeDTO> listServiceTypes();
    ServiceTypeDTO createServiceType(ServiceTypeDTO dto);

    // Categories
    List<CategoryDTO> listCategories();
    CategoryDTO createCategory(CategoryDTO dto);

    // Pricing
    List<PriceListDTO> listPriceLists();
    PriceListDTO createPriceList(PriceListDTO dto);
    void deletePriceList(Long id);

    // Users
    List<CustomerDTO> getAllCustomers();
    List<DriverDTO> getAllDrivers();
    void suspendUser(Long id);
    void activateUser(Long id);
    List<UserDTO> listAllUsers();
    List<OrderDTO> listAllOrders();
    List<OrderItemDTO> getOrderItems(Long orderId);

    // Earnings
    List<EarningsDTO> getEarningsForDriver(Long driverId);

    // Performance
    DriverPerformanceDTO getDriverPerformance(Long driverId);
    CustomerPerformanceDTO getCustomerPerformance(Long customerId);

    // Notification
    void sendNotification(NotificationRequestDTO dto);
    List<NotificationDTO> getAllNotifications();

    // Revenues
    public RevenueReportDTO getTotalRevenue();
    public RevenueReportDTO getRevenueByPeriod(String period);

}
