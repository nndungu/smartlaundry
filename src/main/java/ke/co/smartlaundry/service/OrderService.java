package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.OrderDTO;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EmailService emailService;
    private final SMSService smsService;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        PaymentService paymentService,
                        EmailService emailService,
                        SMSService smsService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    @Transactional
    public OrderDTO checkout(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new NoSuchElementException("Cart not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setItemName(ci.getItemName());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getPrice());
            order.getItems().add(oi);
        }

        orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);

        sendOrderNotifications(user, order);

        // return DTO
        return toDTO(order);
    }

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        return orderRepository.findById(orderId).map(this::toDTO).orElseThrow(() -> new NoSuchElementException("Order not found"));
    }

    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order o = orderRepository.findById(orderId).orElseThrow(() -> new NoSuchElementException("Order not found"));
        o.setStatus(status);
        orderRepository.save(o);
        return toDTO(o);
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    private void sendOrderNotifications(User user, Order order) {
        String subject = "SmartLaundry Order Confirmation";
        String body = String.format("Hi %s,\n\nYour order #%d has been placed.\nStatus: %s\n\nThanks!", user.getUsername(), order.getId(), order.getStatus());
        emailService.sendEmail(user.getEmail(), subject, body);
        smsService.sendSMS(user.getPhoneNumber(), "Order #" + order.getId() + " placed.");
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt()!=null ? order.getCreatedAt().toLocalDateTime() : null);
        dto.setTotalPrice(order.getTotalPrice());
        return dto;
    }
}
