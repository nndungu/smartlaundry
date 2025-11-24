package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;

import java.util.List;

public interface CustomerService {

    // ---------------------------
    // Profile
    // ---------------------------
    CustomerDTO getCustomerProfile(Long customerId);
    void updateProfile(Long customerId, CustomerDTO profileData);
    void deleteAccount(Long customerId);

    // ---------------------------
    // Orders
    // ---------------------------
    List<OrderDTO> getOrdersByCustomer(Long customerId);

    // Alias for getOrdersByCustomer
    default List<OrderDTO> getCustomerOrders(Long customerId) {
        return getOrdersByCustomer(customerId);
    }

    OrderDTO placeOrder(OrderRequestDTO request);
    void cancelOrder(Long id);

    PaymentDTO makePayment(PaymentRequestDTO request, String method);

    // ---------------------------
    // Loyalty
    // ---------------------------
    LoyaltyStatusDTO getLoyaltyStatus(Long customerId);
    LoyaltyLedgerDTO getLoyaltyLedger(Long customerId);

    // ---------------------------
    // Services & Pricing
    // ---------------------------
    List<ServiceTypeDTO> listServiceTypes();
    List<ServiceTypeDTO> getAvailableServices();
    List<ServiceTypeDTO> listServiceTypeName();

    List<CategoryDTO> listCategories();
    List<PriceListDTO> getPriceListForService(Long serviceTypeId);
    List<PriceListDTO> getAvailablePrices();

    // ---------------------------
    // Driver tracking
    // ---------------------------
    DriverLocationDTO getDriverLocation(Long driverId);

    // ---------------------------
    // Notifications
    // ---------------------------
    List<NotificationDTO> getCustomerNotifications(Long customerId);

    // ---------------------------
    // Revenue / Spending
    // ---------------------------
    RevenueReportDTO getCustomerSpending(Long customerId);

    // ---------------------------
    // Performance
    // ---------------------------
    CustomerPerformanceDTO getPerformance(Long customerId);
}
