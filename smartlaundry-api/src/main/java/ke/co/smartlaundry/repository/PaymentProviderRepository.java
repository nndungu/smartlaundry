package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.PaymentProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentProviderRepository extends JpaRepository<PaymentProvider, Long> {
    Optional<PaymentProvider> findByNameIgnoreCase(String name);
}
