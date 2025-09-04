package ke.co.smartlaundry.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "method_id", nullable = false)
    private PaymentMethod method;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "transaction_ref", unique = true)
    private String transactionRef;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // getters and setters
}
