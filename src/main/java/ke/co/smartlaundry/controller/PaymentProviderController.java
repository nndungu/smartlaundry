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

    @GetMapping
    public ResponseEntity<List<PaymentProvider>> getAllProviders() {
        return ResponseEntity.ok(providerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentProvider> getProvider(@PathVariable Long id) {
        PaymentProvider provider = providerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Provider not found"));
        return ResponseEntity.ok(provider);
    }

    @PostMapping
    public ResponseEntity<PaymentProvider> createProvider(@RequestBody PaymentProvider provider) {
        return ResponseEntity.ok(providerRepository.save(provider));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentProvider> updateProvider(@PathVariable Long id,
                                                          @RequestBody PaymentProvider updated) {
        PaymentProvider existing = providerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Provider not found"));

        existing.setName(updated.getName());
        existing.setBaseUrl(updated.getBaseUrl());
        existing.setApiKey(updated.getApiKey());
        existing.setActive(updated.isActive());

        return ResponseEntity.ok(providerRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
