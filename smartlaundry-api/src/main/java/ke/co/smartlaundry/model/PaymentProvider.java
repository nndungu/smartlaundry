package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_provider")
public class PaymentProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // MPESA, STRIPE, etc.

    // getters and setters
}
