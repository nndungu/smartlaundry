package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "loyalty_tier")
public class LoyaltyTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Silver, Gold, Platinum

    @Column(name = "min_points", nullable = false)
    private Integer minPoints;

    // getters and setters
}
