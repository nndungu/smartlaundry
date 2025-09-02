package ke.co.smartlaundry.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {

    @NotBlank
    private String fullName;

    @Email
    private String email;

    private String phone;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String roleName; // <--- Add this

    // Getters & Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRoleName() { return roleName; }  // <--- Add getter
    public void setRoleName(String roleName) { this.roleName = roleName; }  // <--- Add setter
}
