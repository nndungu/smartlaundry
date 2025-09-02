package ke.co.smartlaundry.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    // getters and setters
}
