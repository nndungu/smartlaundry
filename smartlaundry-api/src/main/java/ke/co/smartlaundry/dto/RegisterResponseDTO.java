package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.Role;

public class RegisterResponseDTO {
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private Role role;

    public RegisterResponseDTO(Long userId, String username, String email, String phone, Role role) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    // Getters
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Role getRole() { return role; }
}
