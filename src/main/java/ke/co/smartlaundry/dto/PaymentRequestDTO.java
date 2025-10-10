package ke.co.smartlaundry.dto;

import java.math.BigDecimal;

public class PaymentRequestDTO {
    private Long orderId;
    private Long methodId;     // e.g., 1=MPESA, 2=Stripe
    private BigDecimal amount;
    private String transactionRef;

    // Getters & Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getMethodId() { return methodId; }
    public void setMethodId(Long methodId) { this.methodId = methodId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
}
