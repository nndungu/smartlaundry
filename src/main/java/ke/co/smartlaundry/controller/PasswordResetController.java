package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.PasswordResetDTO;
import ke.co.smartlaundry.dto.PasswordResetRequestDTO;
import ke.co.smartlaundry.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @Autowired
    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    /** Step 1: Request reset link */
    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@RequestBody PasswordResetRequestDTO request) {
        try {
            String token = passwordResetService.createPasswordResetToken(request.getEmail());
            return ResponseEntity.ok("Password reset token: " + token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** Step 2: Validate token (optional but useful for frontend) */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        boolean valid = passwordResetService.validatePasswordResetToken(token);
        if (valid) {
            return ResponseEntity.ok("Valid token");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
    }

    /** Step 3: Reset password */
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDTO dto) {
        try {
            passwordResetService.resetPassword(dto.getToken(), dto.getNewPassword());
            return ResponseEntity.ok("Password successfully reset!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
