package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customer_profile")
public class CustomerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    private String address;

    @Column
    private String city;

    @Column
    private String region;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    // getters and setters
}