package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.PaymentDTO;
import ke.co.smartlaundry.dto.PaymentRequestDTO;
import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.enums.PaymentStatus;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.service.MpesaService;
import ke.co.smartlaundry.service.PaymentService;
import ke.co.smartlaundry.service.EmailService;
import ke.co.smartlaundry.service.SMSService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final MpesaService mpesaService;
    private final EmailService emailService;
    private final SMSService smsService;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              OrderRepository orderRepository,
                              MpesaService mpesaService,
                              EmailService emailService,
                              SMSService smsService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.mpesaService = mpesaService;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    @Override
    public PaymentDTO initiatePayment(PaymentRequestDTO request, String phoneNumber) {
        // create payment record
        var order = orderRepository.findById(request.getOrderId()).orElseThrow(() -> new NoSuchElementException("Order not found"));
        Payment p = new Payment();
        p.setOrder(order);
        p.setMethodId(request.getMethodId());
        p.setAmount(request.getAmount().doubleValue());
        p.setTransactionRef(request.getTransactionRef() != null ? request.getTransactionRef() : "txn-" + System.currentTimeMillis());
        p.setStatus(PaymentStatus.PENDING);
        p.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(p);

        // initiate mpesa
        boolean ok = mpesaService.initiateSTKPush(phoneNumber, p.getAmount(), p.getTransactionRef(), "Payment for order " + order.getId());
        if (!ok) {
            // warn but keep record
        }
        return toDTO(p);
    }

    @Override
    public PaymentDTO initiatePayment(PaymentRequestDTO request) {
        // if phone not passed, derive from order.user
        var order = orderRepository.findById(request.getOrderId()).orElseThrow(() -> new NoSuchElementException("Order not found"));
        String phone = order.getUser().getPhoneNumber();
        return initiatePayment(request, phone);
    }

    @Override
    public List<PaymentDTO> getPaymentsByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public PaymentDTO getPaymentByTransactionRef(String transactionRef) {
        var p = paymentRepository.findByTransactionRef(transactionRef).orElseThrow(() -> new NoSuchElementException("Payment not found"));
        return toDTO(p);
    }

    @Override
    public void handleMpesaCallback(String callbackBody) {
        Map<String, Object> m = mpesaService.parseCallback(callbackBody);
        String checkoutId = m.get("CheckoutRequestID") != null ? m.get("CheckoutRequestID").toString() : null;
        String resultCode = m.get("ResultCode") != null ? m.get("ResultCode").toString() : null;
        if (checkoutId == null) return;
        var opt = paymentRepository.findByTransactionRef(checkoutId);
        if (opt.isEmpty()) return;
        Payment p = opt.get();
        if ("0".equals(resultCode)) {
            p.setStatus(PaymentStatus.SUCCESS);
            var order = p.getOrder();
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
            // notify
            emailService.sendEmail(order.getUser().getEmail(), "Payment received", "Your payment succeeded.");
            smsService.sendSMS(order.getUser().getPhoneNumber(), "Payment successful for order " + order.getId());
        } else {
            p.setStatus(PaymentStatus.FAILED);
        }
        paymentRepository.save(p);
    }

    @Override
    public void refundPayment(Long paymentId) {
        // implement when needed
    }

    @Override
    public void confirmPayment(String transactionRef) {
        // optional confirm hook
    }

    private PaymentDTO toDTO(Payment p) {
        return new PaymentDTO(p.getId(), p.getOrder().getId(), p.getMethod(), p.getAmount(), p.getTransactionRef(), p.getStatus(), p.getCreatedAt());
    }
}
