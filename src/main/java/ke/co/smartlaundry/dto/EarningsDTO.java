package ke.co.smartlaundry.dto;

import java.time.LocalDateTime;

public class EarningsDTO {

    private Long id;
    private Long driverId;
    private Double amount;
    private String transactionType;
    private LocalDateTime createdAt;

    public EarningsDTO() {}

    public EarningsDTO(Long id, Long driverId, Double amount, String transactionType, LocalDateTime createdAt) {
        this.id = id;
        this.driverId = driverId;
        this.amount = amount;
        this.transactionType = transactionType;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
