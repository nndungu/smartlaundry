package ke.co.smartlaundry.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "earnings_ledger")
public class EarningsLedger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Driver or Owner

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // getters and setters
}
