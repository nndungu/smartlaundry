/*
package ke.co.smartlaundry.service;

import ke.co.smartlaundry.enums.OrderStatus;
import ke.co.smartlaundry.enums.PaymentStatus;
import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.Payment;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.OrderRepository;
import ke.co.smartlaundry.repository.PaymentRepository;
import ke.co.smartlaundry.service.EmailService;
import ke.co.smartlaundry.service.MpesaService;
import ke.co.smartlaundry.service.SMSService;
import ke.co.smartlaundry.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class PaymentServiceUnitTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @MockitoBean
    private MpesaService mpesaService;

    @MockitoBean
    private SMSService smsService;

    @MockitoBean
    private EmailService emailService;

    private PaymentServiceImpl paymentService;

    private Order order;
    private User user;

    @BeforeEach
    void setup() {
        paymentService = new PaymentServiceImpl(paymentRepository, orderRepository, mpesaService, emailService, smsService);

        // Create a test user and order
        user = new User();
        user.setId(1L);
        user.setEmail("testuser@example.com");
        user.setUsername("Test User");
        user.setPhoneNumber("0700000000");

        order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(150.0);
        order.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        order.setUser(user);

        orderRepository.save(order);
    }

    @Test
    @DisplayName("Handle successful Mpesa callback should update payment and order status")
    void handleMpesaCallback_success() {
        // Create pending payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(150.0);
        payment.setTransactionRef("txn123");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());

        paymentRepository.save(payment);

        // Mock Mpesa callback data
        Map<String, Object> callbackData = Map.of(
                "CheckoutRequestID", "txn123",
                "ResultCode", "0"
        );
        when(mpesaService.parseCallback(anyString())).thenReturn(callbackData);

        // Call payment callback
        paymentService.handleMpesaCallback("dummyCallbackJson");

        // Verify payment updated
        Payment updatedPayment = paymentRepository.findByTransactionRef("txn123").orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.SUCCESS);

        // Verify order updated
        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updatedOrder.getStatus()).isEqualTo(OrderStatus.PAID);

        // Verify notifications sent
        verify(emailService).sendEmail(eq(user.getEmail()), anyString(), anyString());
        verify(smsService).sendSMS(eq(user.getPhoneNumber()), contains("Payment successful"));
    }

    @Test
    @DisplayName("Handle failed Mpesa callback should mark payment failed")
    void handleMpesaCallback_failed() {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(150.0);
        payment.setTransactionRef("txnFailed");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Map<String, Object> callbackData = Map.of(
                "CheckoutRequestID", "txnFailed",
                "ResultCode", "1"  // Non-zero means failure
        );
        when(mpesaService.parseCallback(anyString())).thenReturn(callbackData);

        paymentService.handleMpesaCallback("dummyCallbackJson");

        Payment updatedPayment = paymentRepository.findByTransactionRef("txnFailed").orElseThrow();
        assertThat(updatedPayment.getStatus()).isEqualTo(PaymentStatus.FAILED);

        // Notifications should not be sent
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
        verify(smsService, never()).sendSMS(anyString(), anyString());
    }
}
*/
