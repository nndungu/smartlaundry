package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
public class PasswordResetController {

    private final PasswordResetService resetService;

    public PasswordResetController(PasswordResetService resetService) {
        this.resetService = resetService;
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestReset(@RequestParam String email) {
        resetService.initiateReset(email);
        return ResponseEntity.ok("Password reset email and OTP sent");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String token,
                                            @RequestParam String otp) {
        resetService.verifyOtp(token, otp);
        return ResponseEntity.ok("OTP verified successfully");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestParam String token,
                                                @RequestParam String newPassword) {
        resetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password has been reset successfully");
    }
}
