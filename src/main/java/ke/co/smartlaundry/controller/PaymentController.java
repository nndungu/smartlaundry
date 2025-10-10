package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.model.PaymentStatus;
import ke.co.smartlaundry.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create a new payment
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(
            @RequestParam Long orderId,
            @RequestParam Long methodId,
            @RequestParam Double amount,
            @RequestParam String transactionRef) {

        PaymentDTO payment = paymentService.createPayment(orderId, methodId, amount, transactionRef);
        return ResponseEntity.ok(payment);
    }

    // Update payment status
    @PutMapping("/status")
    public ResponseEntity<PaymentDTO> updateStatus(
            @RequestParam String transactionRef,
            @RequestParam PaymentStatus status) {

        PaymentDTO payment = paymentService.updatePaymentStatus(transactionRef, status);
        return ResponseEntity.ok(payment);
    }

    // Get all payments for an order
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByOrder(@PathVariable Long orderId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByOrder(orderId);
        return ResponseEntity.ok(payments);
    }
}
