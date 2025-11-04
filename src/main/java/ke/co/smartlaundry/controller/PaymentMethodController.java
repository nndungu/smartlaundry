package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.PaymentMethod;
import ke.co.smartlaundry.repository.PaymentMethodRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodRepository methodRepository;

    public PaymentMethodController(PaymentMethodRepository methodRepository) {
        this.methodRepository = methodRepository;
    }

    // ----------------------------
    // List all payment methods
    // ----------------------------
    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllMethods() {
        return ResponseEntity.ok(methodRepository.findAll());
    }

    // ----------------------------
    // Get one payment method
    // ----------------------------
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethod> getMethodById(@PathVariable Long id) {
        PaymentMethod method = methodRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Payment method not found"));
        return ResponseEntity.ok(method);
    }

    // ----------------------------
    // Create a new payment method
    // ----------------------------
    @PostMapping
    public ResponseEntity<PaymentMethod> createMethod(@RequestBody PaymentMethod method) {
        if (method.getCode() == null || method.getCode().isBlank()) {
            throw new IllegalArgumentException("Payment code is required (e.g. MPESA, CARD)");
        }

        if (methodRepository.findByCode(method.getCode()).isPresent()) {
            throw new IllegalArgumentException("Payment method with code '" + method.getCode() + "' already exists");
        }

        return ResponseEntity.ok(methodRepository.save(method));
    }

    // ----------------------------
    // Update an existing payment method
    // ----------------------------
    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> updateMethod(@PathVariable Long id, @RequestBody PaymentMethod updated) {
        PaymentMethod existing = methodRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Payment method not found"));

        if (updated.getDisplayName() != null)
            existing.setDisplayName(updated.getDisplayName());

        if (updated.getProvider() != null)
            existing.setProvider(updated.getProvider());

        if (updated.getIsActive() != null)
            existing.setIsActive(updated.getIsActive());

        return ResponseEntity.ok(methodRepository.save(existing));
    }

    // ----------------------------
    // Delete payment method
    // ----------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMethod(@PathVariable Long id) {
        if (!methodRepository.existsById(id)) {
            throw new NoSuchElementException("Payment method not found");
        }
        methodRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

