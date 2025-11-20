package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.PaymentMethod;
import ke.co.smartlaundry.enums.PaymentStatus;

import java.time.LocalDateTime;

public class PaymentDTO {
    private Long id;
    private Long orderId;
    private String methodCode;
    private Double amount;
    private String transactionRef;
    private PaymentStatus status;
    private LocalDateTime createdAt;

    public PaymentDTO() {}

    public PaymentDTO(Long id, Long orderId, PaymentMethod method, Double amount, String transactionRef, PaymentStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.methodCode = method != null ? method.getCode() : null;
        this.amount = amount;
        this.transactionRef = transactionRef;
        this.status = status;
        this.createdAt = createdAt;
    }

    public PaymentDTO(String txn12345, String method, Double amount, String success) {
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getMethodCode() { return methodCode; }
    public void setMethodCode(String methodCode) { this.methodCode = methodCode; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
