package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.dto.PaymentRequestDTO;

import java.util.List;

public interface PaymentService {
    // overloads: controllers call either form
    PaymentDTO initiatePayment(PaymentRequestDTO request, String phoneNumber);
    PaymentDTO initiatePayment(PaymentRequestDTO request);

    List<PaymentDTO> getPaymentsByOrder(Long orderId);
    PaymentDTO getPaymentByTransactionRef(String transactionRef);
    void handleMpesaCallback(String callbackBody);
    void refundPayment(Long paymentId);

    // optional confirm endpoint
    default void confirmPayment(String transactionRef) {}
}
