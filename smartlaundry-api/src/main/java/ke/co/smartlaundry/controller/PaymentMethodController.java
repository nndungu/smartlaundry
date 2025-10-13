package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.PaymentMethod;
import ke.co.smartlaundry.model.PaymentProvider;
import ke.co.smartlaundry.repository.PaymentMethodRepository;
import ke.co.smartlaundry.repository.PaymentProviderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodRepository methodRepository;
    private final PaymentProviderRepository providerRepository;

    public PaymentMethodController(PaymentMethodRepository methodRepository,
                                   PaymentProviderRepository providerRepository) {
        this.methodRepository = methodRepository;
        this.providerRepository = providerRepository;
    }

    // ✅ Get all methods
    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllMethods() {
        return ResponseEntity.ok(methodRepository.findAll());
    }

    // ✅ Get method by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethod> getMethodById(@PathVariable Long id) {
        PaymentMethod method = methodRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Payment method not found"));
        return ResponseEntity.ok(method);
    }

    // ✅ Create new method
    @PostMapping
    public ResponseEntity<PaymentMethod> createMethod(@RequestBody PaymentMethod method) {
        if (method.getProvider() == null || method.getProvider().getId() == null) {
            throw new IllegalArgumentException("Provider must be specified");
        }

        PaymentProvider provider = providerRepository.findById(method.getProvider().getId())
                .orElseThrow(() -> new NoSuchElementException("Provider not found"));

        method.setProvider(provider);
        return ResponseEntity.ok(methodRepository.save(method));
    }

    // ✅ Update method
    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> updateMethod(@PathVariable Long id, @RequestBody PaymentMethod updated) {
        PaymentMethod existing = methodRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Payment method not found"));

        existing.setType(updated.getType());

        if (updated.getProvider() != null && updated.getProvider().getId() != null) {
            PaymentProvider provider = providerRepository.findById(updated.getProvider().getId())
                    .orElseThrow(() -> new NoSuchElementException("Provider not found"));
            existing.setProvider(provider);
        }

        return ResponseEntity.ok(methodRepository.save(existing));
    }

    // ✅ Delete method
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMethod(@PathVariable Long id) {
        if (!methodRepository.existsById(id)) {
            throw new NoSuchElementException("Payment method not found");
        }
        methodRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
