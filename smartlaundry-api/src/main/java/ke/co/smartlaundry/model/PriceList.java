package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "price_list")
public class PriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne
    @JoinColumn(name = "service_type_id", nullable = false)
    private ServiceType serviceType;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String unit; // per kg, per item, etc.

    // getters and setters
}
