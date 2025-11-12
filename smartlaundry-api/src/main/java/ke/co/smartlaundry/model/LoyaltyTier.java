package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "loyalty_tier")
public class LoyaltyTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tierName; // Example: Bronze, Silver, Gold, Platinum

    @Column(name = "min_points", nullable = false)
    private Integer minPoints;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTierName() { return tierName; }
    public void setTierName(String tierName) { this.tierName = tierName; }

    public Integer getMinPoints() { return minPoints; }
    public void setMinPoints(Integer minPoints) { this.minPoints = minPoints; }
}
