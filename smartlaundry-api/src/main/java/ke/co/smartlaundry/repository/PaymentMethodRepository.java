package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByProviderId(Long providerId);
}
