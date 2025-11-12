package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.LoyaltyTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoyaltyTierRepository extends JpaRepository<LoyaltyTier, Long> {

    LoyaltyTier findByTierName(String tierName);
}
