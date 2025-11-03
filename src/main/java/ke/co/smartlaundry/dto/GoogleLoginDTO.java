package ke.co.smartlaundry.dto;

public class GoogleLoginDTO {

    private String idToken;

    public GoogleLoginDTO() {}

    public GoogleLoginDTO(String idToken) {
        this.idToken = idToken;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
