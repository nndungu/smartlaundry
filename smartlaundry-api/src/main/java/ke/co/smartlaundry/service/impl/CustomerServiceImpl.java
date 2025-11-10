package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final LoyaltyLedgerRepository loyaltyLedgerRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final CategoryRepository categoryRepository;
    private final PriceListRepository priceListRepository;

    public CustomerServiceImpl(UserRepository userRepository,
                               OrderRepository orderRepository,
                               LoyaltyLedgerRepository loyaltyLedgerRepository,
                               ServiceTypeRepository serviceTypeRepository,
                               CategoryRepository categoryRepository,
                               PriceListRepository priceListRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.loyaltyLedgerRepository = loyaltyLedgerRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.categoryRepository = categoryRepository;
        this.priceListRepository = priceListRepository;
    }

    // ---------------------------
    // Profile
    // ---------------------------
    @Override
    public CustomerDTO getCustomerProfile(Long customerId) {
        User u = userRepository.findById(customerId)
                .orElseThrow(() -> new NoSuchElementException("Customer not found"));
        return new CustomerDTO(u.getId(), u.getUsername(), u.getEmail(), u.getPhoneNumber(), u.isVerified());
    }

    @Override
    public void updateProfile(Long customerId, CustomerDTO profileData) {
        User u = userRepository.findById(customerId).orElseThrow(() -> new NoSuchElementException("User not found"));
        if (profileData.getUsername() != null) u.setUsername(profileData.getUsername());
        if (profileData.getEmail() != null) u.setEmail(profileData.getEmail());
        if (profileData.getPhoneNumber() != null) u.setPhoneNumber(profileData.getPhoneNumber());
        userRepository.save(u);
    }

    @Override
    public void deleteAccount(Long customerId) {
        userRepository.deleteById(customerId);
    }

    // ---------------------------
    // Orders
    // ---------------------------
    @Override
    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByUserId(customerId).stream()
                .map(o -> new OrderDTO(o.getId(), o.getStatus(), o.getTotalPrice(), o.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getCustomerOrders(Long customerId) {
        return getOrdersByCustomer(customerId);
    }

    @Override
    public OrderDTO placeOrder(OrderRequestDTO request) {
        // Implement order creation logic here
        return null;
    }

    @Override
    public void cancelOrder(Long id) {
        // Implement order cancellation here
    }

    @Override
    public PaymentDTO makePayment(PaymentRequestDTO request, String method) {
        // Implement payment logic
        return null;
    }

    // ---------------------------
    // Loyalty
    // ---------------------------
    @Override
    public LoyaltyStatusDTO getLoyaltyStatus(Long customerId) {
        var opt = loyaltyLedgerRepository.findTopByCustomerIdOrderByCreatedAtDesc(customerId);
        if (opt.isEmpty()) return new LoyaltyStatusDTO("Bronze", 0);
        LoyaltyLedger ledger = opt.get();
        String tierName = "Bronze";
        if (ledger.getTier() != null && ledger.getTier().getTierName() != null) tierName = ledger.getTier().getTierName();
        int points = (ledger.getPointsEarned() != null ? ledger.getPointsEarned() : 0)
                - (ledger.getPointsRedeemed() != null ? ledger.getPointsRedeemed() : 0);
        return new LoyaltyStatusDTO(tierName, points);
    }

    @Override
    public LoyaltyLedgerDTO getLoyaltyLedger(Long customerId) {
        List<LoyaltyLedger> entries = loyaltyLedgerRepository.findByCustomerId(customerId);
        double total = entries.stream()
                .mapToDouble(e -> (e.getPointsEarned() != null ? e.getPointsEarned() : 0)
                        - (e.getPointsRedeemed() != null ? e.getPointsRedeemed() : 0))
                .sum();
        List<LoyaltyEntryDTO> dtoEntries = entries.stream()
                .map(e -> new LoyaltyEntryDTO(
                        e.getId(),
                        e.getOrder() != null ? e.getOrder().getId() : null,
                        e.getPointsEarned(),
                        e.getPointsRedeemed(),
                        e.getCreatedAt()))
                .collect(Collectors.toList());
        return new LoyaltyLedgerDTO(customerId, total, dtoEntries);
    }

    // ---------------------------
    // Services & Pricing
    // ---------------------------
    @Override
    public List<ServiceTypeDTO> listServiceTypes() {
        return serviceTypeRepository.findAll().stream()
                .map(s -> new ServiceTypeDTO(s.getId(), s.getCode(), s.getName(), s.getDescription(), s.getBasePrice()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceTypeDTO> getAvailableServices() {
        return serviceTypeRepository.findAll().stream()
                .map(s -> new ServiceTypeDTO(s.getId(), s.getName(), s.getDescription(), s.getBasePrice()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceTypeDTO> listServiceTypeName() {
        return serviceTypeRepository.findAll().stream()
                .map(s -> new ServiceTypeDTO(s.getId(), s.getName(), null, null, null))
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDTO> listCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName(), c.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    public List<PriceListDTO> getPriceListForService(Long serviceTypeId) {
        return priceListRepository.findByServiceTypeId(serviceTypeId).stream()
                .map(p -> new PriceListDTO(p.getId(), p.getServiceType().getId(),
                        p.getCategory().getId(), p.getServiceType().getName(), p.getCategory().getName(), p.getUnitPrice()))
                .collect(Collectors.toList());
    }

    @Override
    public List<PriceListDTO> getAvailablePrices() {
        return priceListRepository.findAll().stream()
                .map(p -> new PriceListDTO(p.getId(), p.getServiceType().getId(),
                        p.getCategory().getId(), p.getServiceType().getName(),
                        p.getCategory().getName(), p.getUnitPrice()))
                .collect(Collectors.toList());
    }

    // ---------------------------
    // Driver Location
    // ---------------------------
    @Override
    public DriverLocationDTO getDriverLocation(Long driverId) {
        User d = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));
        return new DriverLocationDTO(d.getId(), d.getLatitude(), d.getLongitude());
    }

    // ---------------------------
    // Customer Performance
    // ---------------------------
    @Override
    public CustomerPerformanceDTO getPerformance(Long customerId) {
        int totalOrdersPlaced = orderRepository.countByUserId(customerId);
        double totalSpent = orderRepository.findByUserId(customerId).stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
        double averageOrderValue = totalOrdersPlaced > 0 ? totalSpent / totalOrdersPlaced : 0;

        CustomerPerformanceDTO dto = new CustomerPerformanceDTO();
        dto.setTotalOrdersPlaced(totalOrdersPlaced);
        dto.setTotalSpent(totalSpent);
        dto.setAverageOrderValue(averageOrderValue);
        return dto;
    }
}
