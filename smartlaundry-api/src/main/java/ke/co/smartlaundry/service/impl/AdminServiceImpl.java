package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.service.AdminService;
import ke.co.smartlaundry.service.EmailService;
import ke.co.smartlaundry.service.SMSService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final OrderItemRepository orderItemRepository;
    private final EmailService emailService;
    private final SMSService smsService;

    public AdminServiceImpl(UserRepository userRepository,
                            RoleRepository roleRepository,
                            ServiceTypeRepository serviceTypeRepository,
                            CategoryRepository categoryRepository,
                            PriceListRepository priceListRepository,
                            EarningsLedgerRepository earningsLedgerRepository,
                            OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            EmailService emailService,
                            SMSService smsService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.categoryRepository = categoryRepository;
        this.priceListRepository = priceListRepository;
        this.earningsLedgerRepository = earningsLedgerRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.emailService = emailService;
        this.smsService = smsService;
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
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));
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
        double averageRating = 4.5; // placeholder for future rating integration

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

    // ---------------------------
    // Notifications
    // ---------------------------
    @Override
    public void sendNotification(NotificationRequestDTO dto) {
        if (dto == null) throw new IllegalArgumentException("Notification request cannot be null");

        String messageBody = dto.getMessage();
        String subject = dto.getTitle() != null ? dto.getTitle() : "SmartLaundry Notification";

        if ("ALL".equalsIgnoreCase(dto.getRecipientRole())) {
            List<User> allUsers = userRepository.findAll();
            allUsers.forEach(user -> deliverNotification(user, dto.getChannel(), subject, messageBody));
            return;
        }

        if (dto.getRecipientRole() != null && dto.getRecipientId() == null) {
            Role role = roleRepository.findByName(dto.getRecipientRole())
                    .orElseThrow(() -> new NoSuchElementException("Role not found: " + dto.getRecipientRole()));
            List<User> users = userRepository.findByRole(role);
            users.forEach(user -> deliverNotification(user, dto.getChannel(), subject, messageBody));
            return;
        }

        if (dto.getRecipientId() != null) {
            User user = userRepository.findById(dto.getRecipientId())
                    .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + dto.getRecipientId()));
            deliverNotification(user, dto.getChannel(), subject, messageBody);
        }
    }

    private void deliverNotification(User user, String channel, String subject, String message) {
        if (user == null) return;

        switch (channel.toUpperCase()) {
            case "EMAIL" -> {
                if (user.getEmail() != null && !user.getEmail().isBlank()) {
                    emailService.sendEmail(user.getEmail(), subject, message);
                }
            }
            case "SMS" -> {
                if (user.getPhoneNumber() != null && !user.getPhoneNumber().isBlank()) {
                    smsService.sendSMS(user.getPhoneNumber(), message);
                }
            }
            default -> System.out.println("📩 In-app notification: " + message + " → " + user.getUsername());
        }
    }

    @Override
    public List<NotificationDTO> getAllNotifications() {
        // Placeholder — integrate with NotificationRepository later
        return List.of();
    }

    // ---------------------------
    // Revenue Reports
    // ---------------------------
    @Override
    public RevenueReportDTO getTotalRevenue() {
        List<Order> orders = orderRepository.findAll();
        LocalDate today = LocalDate.now();

        double totalRevenue = orders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        double revenueThisMonth = orders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> {
                    LocalDate orderDate = o.getCreatedAt().toLocalDateTime().toLocalDate();
                    return orderDate.getMonth() == today.getMonth() &&
                            orderDate.getYear() == today.getYear();
                })
                .mapToDouble(Order::getTotalPrice)
                .sum();

        double revenueThisWeek = orders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> {
                    LocalDate orderDate = o.getCreatedAt().toLocalDateTime().toLocalDate();
                    return !orderDate.isBefore(today.minusDays(7)); // last 7 days
                })
                .mapToDouble(Order::getTotalPrice)
                .sum();

        double revenueToday = orders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> o.getCreatedAt().toLocalDateTime().toLocalDate().isEqual(today))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        return RevenueReportDTO.builder()
                .totalRevenue(totalRevenue)
                .revenueThisMonth(revenueThisMonth)
                .revenueThisWeek(revenueThisWeek)
                .revenueToday(revenueToday)
                .build();
    }

    @Override
    public RevenueReportDTO getRevenueByPeriod(String period) {
        LocalDate now = LocalDate.now();
        LocalDate startDate;

        switch (period.toLowerCase()) {
            case "daily" -> startDate = now;
            case "weekly" -> startDate = now.minusDays(7);
            case "monthly" -> startDate = now.minusDays(30);
            case "yearly" -> startDate = now.minusDays(365);
            default -> throw new IllegalArgumentException("Invalid period: " + period);
        }

        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> !o.getCreatedAt().toLocalDateTime().toLocalDate().isBefore(startDate))
                .toList();

        double total = orders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        List<RevenueBreakdownDTO> breakdowns = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().toLocalDateTime().toLocalDate().toString(), // group by date
                        Collectors.summingDouble(Order::getTotalPrice)
                ))
                .entrySet().stream()
                .map(e -> new RevenueBreakdownDTO(e.getKey(), e.getValue()))
                .toList();

        return RevenueReportDTO.builder()
                .totalRevenue(total)
                .breakdowns(breakdowns)
                .build();
    }
}
