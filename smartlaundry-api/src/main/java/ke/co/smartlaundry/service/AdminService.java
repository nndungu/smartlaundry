package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;
import java.util.List;

public interface AdminService {

    // Profile
    AdminDTO getAdminProfile(Long adminId);
    AdminDTO getAdminProfileByEmail(String email); // <-- add this

    // Dashboard
    AdminDashboardDTO getDashboardMetrics();

    // Analytics
    ServiceAnalyticsDTO getServiceAnalytics();

    void addServiceType(ServiceTypeDTO dto);
    void deleteServiceType(Long id);

    // Users
    List<CustomerDTO> getAllCustomers();
    List<DriverDTO> getAllDrivers();
    void suspendUser(Long id);
    void activateUser(Long id);

    AdminDashboardDTO getDashboardStats();

    List<UserDTO> listAllUsers();
    List<OrderDTO> listAllOrders();

    // Services
    List<ServiceTypeDTO> listServiceTypes();
    ServiceTypeDTO createServiceType(ServiceTypeDTO dto);

    // Categories
    List<CategoryDTO> listCategories();
    CategoryDTO createCategory(CategoryDTO dto);

    // Pricing
    List<PriceListDTO> listPriceLists();
    PriceListDTO createPriceList(PriceListDTO dto);
    void deletePriceList(Long id);

    // Driver earnings
    List<EarningsDTO> getEarningsForDriver(Long driverId);
}
