package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.Role;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private Role role;
    private String password;
    private String passwordHash;
    private Boolean isActive;

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) { this.id = id; }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword( String password) {
        this.password = password;
    }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() {
        return role;
    }
    public void setRole(Role roleName) {
        this.role = roleName;
    }

    public Boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
