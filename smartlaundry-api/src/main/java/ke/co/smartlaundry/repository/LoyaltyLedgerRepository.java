package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.LoyaltyLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoyaltyLedgerRepository extends JpaRepository<LoyaltyLedger, Long> {
    // For multiple records
    List<LoyaltyLedger> findByCustomerId(Long customerId);

    // Optional single record (latest or current)
    Optional<LoyaltyLedger> findTopByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
