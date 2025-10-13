package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.PaymentProvider;
import ke.co.smartlaundry.repository.PaymentProviderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/payment-providers")
public class PaymentProviderController {

    private final PaymentProviderRepository providerRepository;

    public PaymentProviderController(PaymentProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    // ✅ Get all providers
    @GetMapping
    public ResponseEntity<List<PaymentProvider>> getAllProviders() {
        return ResponseEntity.ok(providerRepository.findAll());
    }

    // ✅ Get provider by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentProvider> getProviderById(@PathVariable Long id) {
        PaymentProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Provider not found"));
        return ResponseEntity.ok(provider);
    }

    // ✅ Create new provider
    @PostMapping
    public ResponseEntity<PaymentProvider> createProvider(@RequestBody PaymentProvider provider) {
        return ResponseEntity.ok(providerRepository.save(provider));
    }

    // ✅ Update existing provider
    @PutMapping("/{id}")
    public ResponseEntity<PaymentProvider> updateProvider(@PathVariable Long id, @RequestBody PaymentProvider updated) {
        PaymentProvider existing = providerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Provider not found"));
        existing.setName(updated.getName());
        return ResponseEntity.ok(providerRepository.save(existing));
    }

    // ✅ Delete provider
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
