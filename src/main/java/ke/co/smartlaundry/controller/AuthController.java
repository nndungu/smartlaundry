package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager; // ✅ use the configured bean

    public AuthController(UserService userService, RoleRepository roleRepository, JwtUtil jwtUtil) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
    }

    // ==============================
    // 🔑 REGISTER NEW USER
    // ==============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO dto) {
        Role role = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new NoSuchElementException("Default role CUSTOMER not found"));

        User user = userService.fromRegisterDTO(dto, role);
        user = userService.createUser(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token, userService.toDTO(user)));
    }

    // ==============================
    // 🔐 LOGIN USER (uses AuthenticationManager)
    // ==============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO dto) {
        try {
            User user = userService.getUserByEmail(dto.getEmail());

            // ✅ Use passwordEncoder check — avoids circular dependency
            if (!userService.checkPassword(dto.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponseDTO(token, userService.toDTO(user)));

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }


    // ==============================
    // 📨 FORGOT PASSWORD
    // ==============================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid PasswordResetRequestDTO dto) {
        try {
            userService.createPasswordResetToken(dto.getEmail());
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        }
    }

    // ==============================
    // 🔄 RESET PASSWORD
    // ==============================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        boolean success = userService.resetPassword(dto.getToken(), dto.getNewPassword());
        if (!success) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        return ResponseEntity.ok("Password reset successful");
    }
}

