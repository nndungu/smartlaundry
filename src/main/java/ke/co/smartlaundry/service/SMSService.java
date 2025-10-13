package ke.co.smartlaundry.service;

public interface SMSService {
    /**
     * Send an SMS message. Returns true if send succeeded (or queued), false otherwise.
     */
    boolean sendSMS(String phoneNumber, String message);
}
