package ke.co.smartlaundry.dto;

public class DriverLocationDTO {
    private Long driverId;
    private Double latitude;
    private Double longitude;

    public DriverLocationDTO() {}

    public DriverLocationDTO(Long driverId, Double latitude, Double longitude) {
        this.driverId = driverId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public DriverLocationDTO(Long driverId, double latitude, double longitude, String online) {
        this.driverId = driverId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
