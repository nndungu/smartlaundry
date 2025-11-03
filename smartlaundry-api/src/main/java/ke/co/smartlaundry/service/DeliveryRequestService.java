package ke.co.smartlaundry.service;

import ke.co.smartlaundry.enums.DeliveryStatus;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.model.DeliveryRequest;
import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.repository.DeliveryRequestRepository;
import ke.co.smartlaundry.repository.OrderRepository;
import ke.co.smartlaundry.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DeliveryRequestService {

    private final DeliveryRequestRepository deliveryRequestRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DeliveryRequestService(DeliveryRequestRepository deliveryRequestRepository,
                                  OrderRepository orderRepository,
                                  UserRepository userRepository) {
        this.deliveryRequestRepository = deliveryRequestRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public DeliveryRequest createDeliveryRequest(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));
        DeliveryRequest request = new DeliveryRequest();
        request.setOrder(order);
        request.setStatus(DeliveryStatus.PENDING);
        return deliveryRequestRepository.save(request);
    }

    public List<DeliveryRequest> getPendingRequests() {
        return deliveryRequestRepository.findByStatus(DeliveryStatus.PENDING);
    }

    public DeliveryRequest acceptRequest(Long requestId, Long driverId) {
        DeliveryRequest request = deliveryRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Request not found"));
        if (request.getStatus() != DeliveryStatus.PENDING)
            throw new IllegalStateException("Request already taken or closed");

        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));

        request.setDriver(driver);
        request.setStatus(DeliveryStatus.ACCEPTED);
        request.setAcceptedAt(LocalDateTime.now());
        return deliveryRequestRepository.save(request);
    }

    public DeliveryRequest declineRequest(Long requestId, Long driverId) {
        DeliveryRequest request = deliveryRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Request not found"));

        if (request.getStatus() != DeliveryStatus.PENDING)
            throw new IllegalStateException("Request already processed");

        request.setStatus(DeliveryStatus.DECLINED);
        return deliveryRequestRepository.save(request);
    }

    public DeliveryRequest completeRequest(Long requestId) {
        DeliveryRequest request = deliveryRequestRepository.findById(requestId)
                .orElseThrow(() -> new NoSuchElementException("Request not found"));

        request.setStatus(DeliveryStatus.COMPLETED);
        request.setCompletedAt(LocalDateTime.now());
        return deliveryRequestRepository.save(request);
    }
}
