package ke.co.smartlaundry.service;

public interface SMSService {
    /**
     * Sends an SMS message using the configured provider.
     * @return true if message sent or queued successfully.
     */
    boolean sendSMS(String phoneNumber, String message);
}
