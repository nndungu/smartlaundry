package ke.co.smartlaundry.dto;

import java.math.BigDecimal;

public class PaymentRequestDTO {
    private Long id;
    private Long userId;
    private Long orderId;
    private Long methodId;
    private String methodCode;
    private String reference;
    private Double amount;
    private String transactionRef;

    public PaymentRequestDTO() {}

    public PaymentRequestDTO(Long orderId, Long methodId, Double amount, String transactionRef) {
        this.orderId = orderId;
        this.methodId = methodId;
        this.amount = amount;
        this.transactionRef = transactionRef;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getMethodId() { return methodId; }
    public void setMethodId(Long methodId) { this.methodId = methodId; }

    public String getMethodCode() { return methodCode; }
    public void setMethodCode(String methodCode) { this.methodCode = methodCode; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
}
