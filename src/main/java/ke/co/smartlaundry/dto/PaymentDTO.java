package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.PaymentStatus;

import java.time.LocalDateTime;

public class PaymentDTO {
    private Long id;
    private Long orderId;
    private Long methodId;
    private Double amount;
    private String transactionRef;
    private PaymentStatus status;
    private LocalDateTime createdAt;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getMethodId() { return methodId; }
    public void setMethodId(Long methodId) { this.methodId = methodId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
