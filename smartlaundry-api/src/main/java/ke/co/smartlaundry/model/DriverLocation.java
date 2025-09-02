package ke.co.smartlaundry.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "driver_location")
public class DriverLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    private Double latitude;
    private Double longitude;

    @Column(name = "updated_at", updatable = false, insertable = false)
    private LocalDateTime updatedAt;

    // getters and setters
}
