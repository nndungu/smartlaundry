package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ❌ was "role_id", but your schema defines column name as "id"
    @Column(name = "id")
    private Short id; // SMALLSERIAL -> Short

    @Column(unique = true, nullable = false, length = 50)
    private String name; // e.g. ADMIN, OWNER, STAFF, DRIVER, CUSTOMER

    public Role() {}

    public Role(String name) {
        this.name = name;
    }

    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

