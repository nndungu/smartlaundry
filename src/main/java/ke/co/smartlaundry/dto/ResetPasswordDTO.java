package ke.co.smartlaundry.dto;

import jakarta.validation.constraints.NotBlank;

public class ResetPasswordDTO {

    @NotBlank
    private String token;

    @NotBlank
    private String newPassword;

    // Getters & Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
