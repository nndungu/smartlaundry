package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.OrderDTO;
import ke.co.smartlaundry.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout/{userId}")
    public ResponseEntity<OrderDTO> checkout(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.checkout(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }
}
