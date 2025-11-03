package ke.co.smartlaundry.dto;

public class UpdateOrderStatusRequestDTO {
    private String status; // e.g., PENDING, ACCEPTED, COMPLETED, CANCELLED

    public UpdateOrderStatusRequestDTO() {}

    public UpdateOrderStatusRequestDTO(String status) {
        this.status = status;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
