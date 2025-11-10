package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final CategoryRepository categoryRepository;
    private final PriceListRepository priceListRepository;
    private final EarningsLedgerRepository earningsLedgerRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository; // <-- Injected

    public AdminServiceImpl(UserRepository userRepository,
                            RoleRepository roleRepository,
                            ServiceTypeRepository serviceTypeRepository,
                            CategoryRepository categoryRepository,
                            PriceListRepository priceListRepository,
                            EarningsLedgerRepository earningsLedgerRepository,
                            OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.categoryRepository = categoryRepository;
        this.priceListRepository = priceListRepository;
        this.earningsLedgerRepository = earningsLedgerRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // ---------------------------
    // Profile
    // ---------------------------
    @Override
    public AdminDTO getAdminProfile(Long adminId) {
        if (adminId == null) throw new IllegalArgumentException("Admin ID must not be null");
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new NoSuchElementException("Admin not found"));
        return new AdminDTO(admin.getId(), admin.getUsername(), admin.getEmail(),
                admin.getPhoneNumber(), admin.getRole().getName());
    }

    @Override
    public AdminDTO getAdminProfileByEmail(String email) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Admin not found with email: " + email));
        return new AdminDTO(admin.getId(), admin.getUsername(), admin.getEmail(),
                admin.getPhoneNumber(), admin.getRole().getName());
    }

    // ---------------------------
    // Dashboard & Analytics
    // ---------------------------
    @Override
    public AdminDashboardDTO getDashboardMetrics() {
        return getDashboardStats();
    }

    @Override
    public AdminDashboardDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        double totalEarnings = earningsLedgerRepository.findAll().stream()
                .mapToDouble(EarningsLedger::getAmount).sum();
        return new AdminDashboardDTO(totalUsers, totalOrders, totalEarnings);
    }

    @Override
    public ServiceAnalyticsDTO getServiceAnalytics() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalDrivers = userRepository.countByRole_Name("DRIVER");
        long totalCustomers = userRepository.countByRole_Name("CUSTOMER");
        return new ServiceAnalyticsDTO(totalUsers, totalOrders, totalDrivers, totalCustomers);
    }

    // ---------------------------
    // Users
    // ---------------------------
    @Override
    public List<CustomerDTO> getAllCustomers() {
        Role role = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new NoSuchElementException("Role CUSTOMER not found"));
        return userRepository.findByRole(role).stream()
                .map(u -> new CustomerDTO(u.getId(), u.getUsername(), u.getEmail(),
                        u.getPhoneNumber(), u.isVerified()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DriverDTO> getAllDrivers() {
        Role role = roleRepository.findByName("DRIVER")
                .orElseThrow(() -> new NoSuchElementException("Role DRIVER not found"));
        return userRepository.findByRole(role).stream()
                .map(u -> new DriverDTO(u.getId(), u.getUsername(), u.getEmail(), u.getPhoneNumber()))
                .collect(Collectors.toList());
    }

    @Override
    public void suspendUser(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        u.setActive(false);
        userRepository.save(u);
    }

    @Override
    public void activateUser(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        u.setActive(true);
        userRepository.save(u);
    }

    @Override
    public List<UserDTO> listAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getEmail(),
                        u.getPhoneNumber(), u.getRole() != null ? u.getRole().getName() : null))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> listAllOrders() {
        return orderRepository.findAll().stream()
                .map(o -> new OrderDTO(o.getId(), o.getStatus(), o.getTotalPrice(), o.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderItemDTO> getOrderItems(Long orderId) {
        // Fetch the order, including its items
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        // Map the OrderItem entities to DTOs
        return order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        order.getId(),
                        item.getItemName(),
                        item.getCategory() != null ? item.getCategory().getName() : null,
                        item.getQuantity(),
                        item.getPrice(),
                        item.getTotalPrice()
                ))
                .collect(Collectors.toList());
    }

    // ---------------------------
    // Services, Categories, Pricing
    // ---------------------------
    @Override
    public List<ServiceTypeDTO> listServiceTypes() {
        return serviceTypeRepository.findAll().stream()
                .map(s -> new ServiceTypeDTO(s.getId(), s.getCode(), s.getName(), s.getDescription(), s.getBasePrice()))
                .collect(Collectors.toList());
    }

    @Override
    public void addServiceType(ServiceTypeDTO dto) {
        ServiceType s = new ServiceType();
        s.setCode(dto.getCode());
        s.setName(dto.getName());
        s.setDescription(dto.getDescription());
        s.setBasePrice(dto.getBasePrice());
        serviceTypeRepository.save(s);
    }

    @Override
    public void deleteServiceType(Long id) {
        serviceTypeRepository.deleteById(id);
    }

    @Override
    public ServiceTypeDTO createServiceType(ServiceTypeDTO dto) {
        ServiceType s = new ServiceType();
        s.setCode(dto.getCode());
        s.setName(dto.getName());
        s.setDescription(dto.getDescription());
        s.setBasePrice(dto.getBasePrice());
        ServiceType saved = serviceTypeRepository.save(s);
        return new ServiceTypeDTO(saved.getId(), saved.getCode(), saved.getName(), saved.getDescription(), saved.getBasePrice());
    }

    @Override
    public List<CategoryDTO> listCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName(), c.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category c = new Category();
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(c);
        return new CategoryDTO(saved.getId(), saved.getName(), saved.getDescription());
    }

    @Override
    public List<PriceListDTO> listPriceLists() {
        return priceListRepository.findAll().stream()
                .map(p -> new PriceListDTO(p.getId(), p.getServiceType().getId(),
                        p.getCategory().getId(), p.getServiceType().getName(),
                        p.getCategory().getName(), p.getUnitPrice()))
                .collect(Collectors.toList());
    }

    @Override
    public PriceListDTO createPriceList(PriceListDTO dto) {
        ServiceType s = serviceTypeRepository.findById(dto.getServiceTypeId())
                .orElseThrow(() -> new NoSuchElementException("ServiceType not found"));
        Category c = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Category not found"));
        PriceList p = new PriceList();
        p.setServiceType(s);
        p.setCategory(c);
        p.setUnitPrice(dto.getUnitPrice());
        priceListRepository.save(p);
        return new PriceListDTO(p.getId(), s.getId(), c.getId(), s.getName(), c.getName(), p.getUnitPrice());
    }

    @Override
    public void deletePriceList(Long id) {
        priceListRepository.deleteById(id);
    }

    // ---------------------------
    // Earnings
    // ---------------------------
    @Override
    public List<EarningsDTO> getEarningsForDriver(Long driverId) {
        return earningsLedgerRepository.findByDriverId(driverId).stream()
                .map(e -> new EarningsDTO(e.getId(),
                        e.getDriver() != null ? e.getDriver().getId() : null,
                        e.getAmount(), e.getTransactionType(), e.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // ---------------------------
    // Driver & Customer Performance
    // ---------------------------
    @Override
    public DriverPerformanceDTO getDriverPerformance(Long driverId) {
        double totalEarnings = earningsLedgerRepository.findByDriverId(driverId)
                .stream().mapToDouble(EarningsLedger::getAmount).sum();
        int totalOrdersDelivered = orderRepository.countByDriverId(driverId);
        double averageRating = 4.5; // placeholder, extend with rating system

        DriverPerformanceDTO dto = new DriverPerformanceDTO();
        dto.setTotalOrdersDelivered(totalOrdersDelivered);
        dto.setTotalEarnings(totalEarnings);
        dto.setAverageRating(averageRating);
        return dto;
    }

    @Override
    public CustomerPerformanceDTO getCustomerPerformance(Long customerId) {
        int totalOrdersPlaced = orderRepository.countByUserId(customerId);
        double totalSpent = orderRepository.findByUserId(customerId)
                .stream().mapToDouble(Order::getTotalPrice).sum();
        double averageOrderValue = totalOrdersPlaced > 0 ? totalSpent / totalOrdersPlaced : 0;

        CustomerPerformanceDTO dto = new CustomerPerformanceDTO();
        dto.setTotalOrdersPlaced(totalOrdersPlaced);
        dto.setTotalSpent(totalSpent);
        dto.setAverageOrderValue(averageOrderValue);
        return dto;
    }
}
