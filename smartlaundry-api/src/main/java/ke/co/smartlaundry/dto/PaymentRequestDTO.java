package ke.co.smartlaundry.dto;

import java.math.BigDecimal;

public class PaymentRequestDTO {
    public Long orderId;
    public Long methodId;     // 1=MPESA STK, 2=Paybill, 3=Stripe Card
    public BigDecimal amount;
    public String transactionRef;
}