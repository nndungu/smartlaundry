package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.OrderItem;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.OrderService;
import ke.co.smartlaundry.service.PaymentService;
import ke.co.smartlaundry.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final UserService userService;

    public OrderController(OrderService orderService,
                           PaymentService paymentService,
                           UserService userService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(@RequestBody CheckoutRequestDTO request) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        OrderDTO order = orderService.createOrder(userId, request);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/checkout/pay")
    public ResponseEntity<PaymentDTO> checkoutAndPay(@RequestBody PaymentRequestDTO paymentRequest) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        OrderDTO order = orderService.checkout(userId);
        paymentRequest.setOrderId(order.getId());

        PaymentDTO payment = paymentService.initiatePayment(paymentRequest);
        return ResponseEntity.ok(payment);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        List<OrderDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
