package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.service.DriverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    @Override
    public DriverDTO getDriverProfile(Long driverId) {
        User d = userRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        DriverDTO dto = new DriverDTO();
        dto.setId(d.getId());
        dto.setUsername(d.getUsername());
        dto.setEmail(d.getEmail());
        dto.setPhoneNumber(d.getPhoneNumber());
        return dto;
    }

    @Override
    public List<OrderDTO> getAssignedOrders(Long driverId) {
        return orderRepository.findByDriverId(driverId).stream()
                .map(o -> new OrderDTO(o.getId(), o.getStatus(), o.getTotalPrice(), o.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public DriverEarningsDTO getEarnings(Long driverId) {
        double total = earningsLedgerRepository.sumAmountByDriverId(driverId);
        return new DriverEarningsDTO(driverId, total);
    }

    @Override
    public void updateLocation(Long driverId, double latitude, double longitude) {
        User d = userRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        d.setLatitude(latitude);
        d.setLongitude(longitude);
        userRepository.save(d);
    }

    @Override
    public List<DriverEarningsDetailDTO> getEarningsHistory(Long driverId) {
        return List.of(); // You can implement this later
    }

    @Override
    public DriverPerformanceDTO getPerformance(Long driverId) {
        // Fetch driver info
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        // Total assigned orders
        long totalOrders = orderRepository.countByDriverId(driverId);

        // Completed orders
        long completedOrders = orderRepository.countByDriverIdAndStatus(driverId, OrderStatus.valueOf("COMPLETED"));

        // Earnings
        double totalEarnings = earningsLedgerRepository.sumAmountByDriverId(driverId);

        // Average earnings per completed order
        double avgEarnings = completedOrders > 0 ? totalEarnings / completedOrders : 0.0;

        return new DriverPerformanceDTO(driverId, driver.getUsername(), totalOrders, completedOrders, totalEarnings, avgEarnings);
    }
}
