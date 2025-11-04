package ke.co.smartlaundry.dto;

public class CustomerDTO {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private boolean verified;

    public CustomerDTO() {}

    public CustomerDTO(Long id, String username, String email, String phoneNumber, boolean verified) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.verified = verified;
    }

    public CustomerDTO(Long id, String username, String email, String phoneNumber) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
