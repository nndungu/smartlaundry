package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "service_type")
public class ServiceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Wash & Fold, Dry Cleaning, Ironing

    private String description;

    // getters and setters
}
