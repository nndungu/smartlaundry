package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.OrderDTO;
import ke.co.smartlaundry.dto.OrderItemDTO;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.CartRepository;
import ke.co.smartlaundry.repository.OrderRepository;
import ke.co.smartlaundry.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SMSService smsService;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        EmailService emailService,
                        SMSService smsService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    /**
     * Checkout: convert user's cart to an order
     */
    @Transactional
    public OrderDTO checkout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Cart not found"));

        Order order = new Order();
        order.setUser(user);

        // Copy cart items into order
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setItemName(ci.getItemName());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getPrice());
            order.getItems().add(oi);
        }

        orderRepository.save(order);

        // Clear cart after checkout
        cart.getItems().clear();
        cartRepository.save(cart);

        // Send notifications
        sendNotifications(user, order);

        return toDTO(order);
    }

    /**
     * Get all orders of a user
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a single order by ID
     */
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));
        return toDTO(order);
    }

    /**
     * Update order status
     */
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
        return toDTO(order);
    }

    /**
     * Delete (cancel) an order
     */
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));
        orderRepository.delete(order);
    }

    /**
     * Convert Order entity to DTO
     */
    public OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());

        List<OrderItemDTO> itemDTOs = order.getItems().stream().map(oi -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(oi.getId());
            itemDTO.setItemName(oi.getItemName());
            itemDTO.setQuantity(oi.getQuantity());
            itemDTO.setPrice(oi.getPrice());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }

    /**
     * Send email and SMS notifications after checkout
     */
    private void sendNotifications(User user, Order order) {
        String subject = "Order Confirmation";
        String body = "Hi " + user.getUsername() + ",\n\n" +
                "Your order #" + order.getId() + " has been successfully placed.\n" +
                "Total items: " + order.getItems().size() + "\n" +
                "Status: " + order.getStatus() + "\n\n" +
                "Thank you for using SmartLaundry!";

        emailService.sendEmail(user.getEmail(), subject, body);

        String smsMessage = "Hi " + user.getUsername() + ", your order #" +
                order.getId() + " is placed successfully!";
        smsService.sendSMS(user.getPhone(), smsMessage);
    }
}
