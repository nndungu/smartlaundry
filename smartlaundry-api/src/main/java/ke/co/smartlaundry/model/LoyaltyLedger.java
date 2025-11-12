package ke.co.smartlaundry.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_ledger")
public class LoyaltyLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "points_earned", nullable = false)
    private Integer pointsEarned = 0;

    @Column(name = "points_redeemed", nullable = false)
    private Integer pointsRedeemed = 0;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "tier_id")
    private LoyaltyTier tier;

    // ============================
    // Getters and Setters
    // ============================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public Integer getPointsRedeemed() { return pointsRedeemed; }
    public void setPointsRedeemed(Integer pointsRedeemed) { this.pointsRedeemed = pointsRedeemed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LoyaltyTier getTier() { return tier; }
    public void setTier(LoyaltyTier tier) { this.tier = tier; }

    // ✅ Computed total points
    public Double getPoints() {
        return (double) (pointsEarned - pointsRedeemed);
    }
}
