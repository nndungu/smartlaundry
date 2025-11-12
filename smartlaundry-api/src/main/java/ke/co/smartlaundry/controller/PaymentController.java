package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.dto.PaymentRequestDTO;
import ke.co.smartlaundry.security.SecurityUtils;
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

    /**
     * Initiate a payment (e.g., MPESA STK Push)
     */
    @PostMapping("/initiate")
    public ResponseEntity<PaymentDTO> initiatePayment(@RequestBody PaymentRequestDTO request) {
        Long userId = SecurityUtils.getCurrentUserId();
        request.setUserId(userId);
        PaymentDTO payment = paymentService.initiatePayment(request);
        return ResponseEntity.ok(payment);
    }

    /**
     * Get all payments for a specific order
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOrder(orderId));
    }

    /**
     * Get payment by transaction reference
     */
    @GetMapping("/transaction/{transactionRef}")
    public ResponseEntity<PaymentDTO> getPaymentByTransactionRef(@PathVariable String transactionRef) {
        return ResponseEntity.ok(paymentService.getPaymentByTransactionRef(transactionRef));
    }

    /**
     * ✅ Handle asynchronous callbacks (e.g., MPESA confirmation)
     */
    @PostMapping("/callback/mpesa")
    public ResponseEntity<String> handleMpesaCallback(@RequestBody String callbackBody) {
        paymentService.handleMpesaCallback(callbackBody);
        return ResponseEntity.ok("Callback received successfully");
    }

    /**
     * Refund (future extension)
     */
    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<String> refundPayment(@PathVariable Long paymentId) {
        paymentService.refundPayment(paymentId);
        return ResponseEntity.ok("Refund initiated (if supported)");
    }
}
