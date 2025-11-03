package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.Role;

public class AdminDTO {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;

    public AdminDTO() {}

    public AdminDTO(Long id, String username, String email, String phoneNumber, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }


    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
