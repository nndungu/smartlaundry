package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "branch")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String address;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "created_at", updatable = false, insertable = false)
    private java.sql.Timestamp createdAt;

    // getters and setters
}
