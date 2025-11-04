package ke.co.smartlaundry.dto;

public class LoginResponseDTO {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private String message;
    private String refreshToken;

    public LoginResponseDTO() {}

    // existing constructors
    public LoginResponseDTO(String token, Long userId, String username, String email, String phoneNumber,
                            String role, String message, String refreshToken) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.message = message;
        this.refreshToken = refreshToken;
    }

    public LoginResponseDTO(String token, Long userId, String username, String email, String phoneNumber,
                            String role, String message) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.message = message;
        this.refreshToken = null;
    }

    public LoginResponseDTO(String token, UserDTO user) {
        this.token = token;
        this.userId = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
        this.message = "Login successful";
        this.refreshToken = null;
    }

    // --- Getters and Setters ---
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

}
