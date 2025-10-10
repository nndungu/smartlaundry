package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMethodRepository methodRepository;
    private final EmailService emailService;
    private final SMSService smsService;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          PaymentMethodRepository methodRepository,
                          EmailService emailService,
                          SMSService smsService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.methodRepository = methodRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    /**
     * Create a payment record for an order.
     */
    @Transactional
    public PaymentDTO createPayment(Long orderId, Long methodId, Double amount, String transactionRef) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        PaymentMethod method = methodRepository.findById(methodId)
                .orElseThrow(() -> new NoSuchElementException("Payment method not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(method);
        payment.setAmount(amount);
        payment.setTransactionRef(transactionRef);
        payment.setStatus(PaymentStatus.SUCCESS); // assume success for dev/testing

        paymentRepository.save(payment);

        // ✅ Update order status using Enum (not String)
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Send notifications
        sendPaymentNotification(order.getUser(), payment);

        return toDTO(payment);
    }

    /**
     * Get all payments made for a specific order.
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        return paymentRepository.findByOrder(order)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update payment status based on transaction reference.
     */
    @Transactional
    public PaymentDTO updatePaymentStatus(String transactionRef, PaymentStatus status) {
        Payment payment = paymentRepository.findByTransactionRef(transactionRef)
                .orElseThrow(() -> new NoSuchElementException("Payment not found"));

        payment.setStatus(status);
        paymentRepository.save(payment);

        // If payment is successful, mark order as PAID
        if (status == PaymentStatus.SUCCESS) {
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        }

        // Notify user
        sendPaymentNotification(payment.getOrder().getUser(), payment);

        return toDTO(payment);
    }

    /**
     * Send email and SMS notifications to user after payment.
     */
    private void sendPaymentNotification(User user, Payment payment) {
        String subject = "Payment Confirmation";
        String body = "Hi " + user.getUsername() + ",\n\n" +
                "Your payment of KES " + payment.getAmount() +
                " for order #" + payment.getOrder().getId() +
                " has been successfully processed.\n" +
                "Transaction Ref: " + payment.getTransactionRef() + "\n\n" +
                "Thank you for using SmartLaundry!";

        emailService.sendEmail(user.getEmail(), subject, body);

        String smsMessage = "Hi " + user.getUsername() +
                ", your payment of KES " + payment.getAmount() +
                " for order #" + payment.getOrder().getId() + " is successful.";
        smsService.sendSMS(user.getPhone(), smsMessage);
    }

    /**
     * Convert entity to DTO.
     */
    private PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrder().getId());
        dto.setMethodId(payment.getMethod().getId());
        dto.setAmount(payment.getAmount());
        dto.setTransactionRef(payment.getTransactionRef());
        dto.setStatus(payment.getStatus());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }
}
