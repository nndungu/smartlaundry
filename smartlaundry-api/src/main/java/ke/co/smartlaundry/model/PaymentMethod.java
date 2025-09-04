package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_method")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private PaymentProvider provider;

    @Column(nullable = false)
    private String type; // e.g., CARD, MOBILE, WALLET

    // getters and setters
}
