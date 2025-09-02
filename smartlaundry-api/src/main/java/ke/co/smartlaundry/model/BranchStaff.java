package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "branch_staff")
public class BranchStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each staff is also a User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The branch they work in
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    // e.g., MANAGER, ATTENDANT, CASHIER
    @Column(nullable = false)
    private String role;

    private Boolean isActive = true;

    public BranchStaff(User user) {
        this.user = user;
    }

    // getters and setters
}
