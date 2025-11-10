package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;

import java.util.List;

public interface CustomerService {

    CustomerDTO getCustomerProfile(Long customerId);
    void updateProfile(Long customerId, CustomerDTO profileData);
    void deleteAccount(Long customerId);

    List<OrderDTO> getOrdersByCustomer(Long customerId);

    List<OrderDTO> getCustomerOrders(Long customerId);

    LoyaltyStatusDTO getLoyaltyStatus(Long customerId);
    LoyaltyLedgerDTO getLoyaltyLedger(Long customerId);

    List<ServiceTypeDTO> listServiceTypes();

    List<ServiceTypeDTO> getAvailableServices();

    List<CategoryDTO> listCategories();
    List<PriceListDTO> getPriceListForService(Long serviceTypeId);

    DriverLocationDTO getDriverLocation(Long driverId);

    List<ServiceTypeDTO> listServiceTypeName();

    List<PriceListDTO> getAvailablePrices();

    OrderDTO placeOrder(OrderRequestDTO request);

    void cancelOrder(Long id);

    PaymentDTO makePayment(PaymentRequestDTO request, String method);

    CustomerPerformanceDTO getPerformance(Long userId);
}
