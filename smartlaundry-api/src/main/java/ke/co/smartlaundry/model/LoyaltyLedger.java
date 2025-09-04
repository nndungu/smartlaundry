package ke.co.smartlaundry.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_ledger")
public class LoyaltyLedger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
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

    // getters and setters
}
