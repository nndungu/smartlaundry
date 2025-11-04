package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "branch_staff")
public class BranchStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(nullable = false)
    private String role;

    private Boolean isActive = true;

    // Constructors
    public BranchStaff() {}

    public BranchStaff(User user, Branch branch, String role) {
        this.user = user;
        this.branch = branch;
        this.role = role;
        this.isActive = true;
    }

    public BranchStaff(User user) {
        this.user = user;
        this.isActive = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
