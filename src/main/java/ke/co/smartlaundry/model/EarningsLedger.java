package ke.co.smartlaundry.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "earnings_ledger")
public class EarningsLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The driver associated with this earning entry */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    /** The related order (if applicable) */
    @Column(name = "order_id")
    private Long orderId;

    /** The specific service type performed (washing, delivery, etc.) */
    @Column(name = "service_type_id")
    private Long serviceTypeId;

    /** The amount earned or debited */
    @Column(nullable = false)
    private Double amount;

    /** Transaction type: "CREDIT" for earnings, "DEBIT" for deductions */
    @Column(name = "transaction_type", length = 20, nullable = false)
    private String transactionType;

    /** Timestamp of the transaction */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public EarningsLedger() {}

    public EarningsLedger(User driver, Long orderId, Long serviceTypeId, Double amount, String transactionType) {
        this.driver = driver;
        this.orderId = orderId;
        this.serviceTypeId = serviceTypeId;
        this.amount = amount;
        this.transactionType = transactionType;
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getServiceTypeId() { return serviceTypeId; }
    public void setServiceTypeId(Long serviceTypeId) { this.serviceTypeId = serviceTypeId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
