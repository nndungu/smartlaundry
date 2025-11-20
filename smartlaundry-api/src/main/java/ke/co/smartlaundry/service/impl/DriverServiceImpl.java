package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.service.DriverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final EarningsLedgerRepository earningsLedgerRepository;

    public DriverServiceImpl(UserRepository userRepository,
                             OrderRepository orderRepository,
                             EarningsLedgerRepository earningsLedgerRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.earningsLedgerRepository = earningsLedgerRepository;
    }

    // ---------------------------
    // Profile
    // ---------------------------
    @Override
    public DriverDTO getDriverProfile(Long driverId) {
        User d = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));
        DriverDTO dto = new DriverDTO();
        dto.setId(d.getId());
        dto.setUsername(d.getUsername());
        dto.setEmail(d.getEmail());
        dto.setPhoneNumber(d.getPhoneNumber());
        return dto;
    }

    // ---------------------------
    // Assigned Orders
    // ---------------------------
    @Override
    public List<OrderDTO> getAssignedOrders(Long driverId) {
        return orderRepository.findByDriverId(driverId).stream()
                .map(o -> new OrderDTO(o.getId(), o.getStatus(), o.getTotalPrice(), o.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // ---------------------------
    // Earnings
    // ---------------------------
    @Override
    public DriverEarningsDTO getEarnings(Long driverId) {
        double total = earningsLedgerRepository.sumAmountByDriverId(driverId);
        return new DriverEarningsDTO(driverId, total);
    }

    @Override
    public List<DriverEarningsDetailDTO> getEarningsHistory(Long driverId) {
        // Placeholder: return empty list until repository implementation
        return List.of();
    }

    @Override
    public RevenueReportDTO getDriverRevenue(Long driverId) {
        List<EarningsLedger> earnings = earningsLedgerRepository.findByDriverId(driverId);
        double total = earnings.stream().mapToDouble(EarningsLedger::getAmount).sum();
        double weekly = earnings.stream()
                .filter(e -> e.getCreatedAt().isAfter(LocalDate.now().minusDays(7).atStartOfDay()))
                .mapToDouble(EarningsLedger::getAmount).sum();

        return RevenueReportDTO.builder()
                .totalRevenue(total)
                .revenueThisWeek(weekly)
                .build();
    }

    // ---------------------------
    // Notifications
    // ---------------------------
    @Override
    public List<NotificationDTO> getDriverNotifications(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));

        return List.of(new NotificationDTO(1L, "Performance Bonus",
                "You earned a weekly performance bonus!", "SYSTEM",
                driver.getUsername(), LocalDateTime.now()));
    }

    // ---------------------------
    // Performance
    // ---------------------------
    @Override
    public DriverPerformanceDTO getPerformance(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));

        long totalOrders = orderRepository.countByDriverId(driverId);
        long completedOrders = orderRepository.countByDriverIdAndStatus(driverId, OrderStatus.COMPLETED);

        double totalEarnings = earningsLedgerRepository.sumAmountByDriverId(driverId);
        double avgEarnings = completedOrders > 0 ? totalEarnings / completedOrders : 0.0;

        return new DriverPerformanceDTO(driverId, driver.getUsername(), totalOrders,
                completedOrders, totalEarnings, avgEarnings);
    }

    // ---------------------------
    // Location
    // ---------------------------
    @Override
    public void updateLocation(Long driverId, double latitude, double longitude) {
        User d = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));
        d.setLatitude(latitude);
        d.setLongitude(longitude);
        userRepository.save(d);
    }
}
