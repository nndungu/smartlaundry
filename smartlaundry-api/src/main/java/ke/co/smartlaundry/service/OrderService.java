package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
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

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

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

        return toDTO(order);
    }

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(order.getItems().stream().map(oi -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(oi.getId());
            itemDTO.setItemName(oi.getItemName());
            itemDTO.setQuantity(oi.getQuantity());
            itemDTO.setPrice(oi.getPrice());
            return itemDTO;
        }).collect(Collectors.toList()));
        return dto;
    }
}
