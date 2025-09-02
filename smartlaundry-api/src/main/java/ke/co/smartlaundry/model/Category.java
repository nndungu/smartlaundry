package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. Clothing, Bedding

    private String description;

    // getters and setters
}
