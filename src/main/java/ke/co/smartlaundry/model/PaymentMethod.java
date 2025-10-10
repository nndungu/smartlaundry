package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_method")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private PaymentProvider provider;

    @Column(nullable = false)
    private String type; // e.g., CARD, MOBILE, WALLET

    // ----------------------
    // Getters & Setters
    // ----------------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PaymentProvider getProvider() { return provider; }
    public void setProvider(PaymentProvider provider) { this.provider = provider; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
