package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.dto.LoginRequestDTO;
import ke.co.smartlaundry.dto.RegisterRequestDTO;
import ke.co.smartlaundry.dto.PasswordResetRequestDTO;
import ke.co.smartlaundry.dto.ResetPasswordDTO;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.security.JwtUtil;
import ke.co.smartlaundry.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, RoleRepository roleRepository, JwtUtil jwtUtil) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
    }

    // --- Registration ---
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid RegisterRequestDTO dto) {
        // 🔒 Always assign USER role to new accounts
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new NoSuchElementException("Default role USER not found"));
        User user = userService.fromRegisterDTO(dto, role);
        user = userService.createUser(user);
        return ResponseEntity.ok(userService.toDTO(user));
    }

    // --- Login ---
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequestDTO dto) {
        try {
            User user = userService.getUserByEmail(dto.getEmail());
            if (!userService.checkPassword(dto.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // --- Forgot Password ---
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid PasswordResetRequestDTO dto) {
        try {
            String token = userService.createPasswordResetToken(dto.getEmail());

            // 🔒 DO NOT expose token in API response
            // TODO: send token via email instead of returning it
            // Example: emailService.sendPasswordResetLink(dto.getEmail(), token);

            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        } catch (NoSuchElementException e) {
            // Respond the same way to avoid leaking which emails exist
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        }
    }

    // --- Reset Password ---
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        boolean success = userService.resetPassword(dto.getToken(), dto.getNewPassword());
        if (!success) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
        return ResponseEntity.ok("Password reset successful");
    }
}
