package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.User;

import java.sql.Timestamp;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private User.Status status = User.Status.ACTIVE;
    private boolean verified = false;
    private Double latitude;
    private Double longitude;

    public UserDTO(Long id, String username, String email, String phoneNumber) {
        this.id = id;
        this.username = username;
        this.phoneNumber = phoneNumber;
    }

    public enum Status {
        ACTIVE,
        SUSPENDED
    }

    public UserDTO() {}

    public UserDTO(Long id, String username, String email, String phoneNumber, String role) {
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
    public void setPhoneNumber(String phoneNumber)  { this.phoneNumber = phoneNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public boolean getIsActive() {
        return status == User.Status.ACTIVE;
    }
    public void setIsActive(boolean status){
        this.status = User.Status.ACTIVE;
    }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
