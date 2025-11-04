package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.OrderDTO;
import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.dto.PaymentRequestDTO;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.OrderService;
import ke.co.smartlaundry.service.PaymentService;
import ke.co.smartlaundry.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // ✅ Create order (checkout)
    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        OrderDTO order = orderService.checkout(userId);
        return ResponseEntity.ok(order);
    }

    // ✅ Checkout and initiate payment
    @PostMapping("/checkout/pay")
    public ResponseEntity<PaymentDTO> checkoutAndPay(@RequestBody PaymentRequestDTO paymentRequest) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        OrderDTO order = orderService.checkout(userId);
        paymentRequest.setOrderId(order.getId());

        UserDTO user = userService.getUserById(userId);
        PaymentDTO payment = paymentService.initiatePayment(paymentRequest);
        return ResponseEntity.ok(payment);
    }

    // ✅ Get all orders for current user
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        List<OrderDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }

    // ✅ Get specific order
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // ✅ Update order status
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // ✅ Delete order
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
