package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")   // <-- match DB column
    private Short id;           // <-- use Short (SMALLINT maps to Short in Java)

    @Column(unique = true, nullable = false)
    private String name; // e.g. ADMIN, USER, STAFF

    public Role() { }

    public Short getId() {
        return id;
    }
    public void setId(Short id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
