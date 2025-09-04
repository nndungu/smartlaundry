package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.AuthResponseDTO;
import ke.co.smartlaundry.dto.RegisterRequestDTO;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, RoleRepository roleRepository, JwtUtil jwtUtil) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
    }

    // ==============================
    // 🔒 ADMIN ENDPOINTS
    // ==============================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponseDTO> createUser(@RequestBody @Valid RegisterRequestDTO dto) {
        String roleName = dto.getRoleName() != null ? dto.getRoleName() : "USER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new NoSuchElementException("Role not found"));

        User user = userService.fromRegisterDTO(dto, role);
        user = userService.createUser(user);

        String token = jwtUtil.generateToken(user.getEmail());
        UserDTO userDTO = userService.toDTO(user);

        return ResponseEntity.ok(new AuthResponseDTO(token, userDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody @Valid RegisterRequestDTO dto) {
        try {
            String roleName = dto.getRoleName() != null ? dto.getRoleName() : null;
            User user = userService.fromRegisterDTO(dto, null); // role handled in service
            User updated = userService.updateUser(id, user, roleName);
            return ResponseEntity.ok(userService.toDTO(updated));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ==============================
    // 👤 SELF-SERVICE ENDPOINTS
    // ==============================

    // Get own profile
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(userService.toDTO(user));
    }

    // Update own profile (name, phone)
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMyProfile(
            Authentication authentication,
            @RequestBody UserDTO dto
    ) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());

        User updated = userService.updateUser(user.getId(), user, null);
        return ResponseEntity.ok(userService.toDTO(updated));
    }

    // Change password
    @PostMapping("/me/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestParam String oldPassword,
            @RequestParam String newPassword
    ) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        if (!userService.checkPassword(oldPassword, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        user.setPasswordHash(userService.encodePassword(newPassword));
        userService.updateUser(user.getId(), user, null);

        return ResponseEntity.ok("Password updated successfully");
    }

    // Change email
    @PostMapping("/me/change-email")
    public ResponseEntity<AuthResponseDTO> changeEmail(
            Authentication authentication,
            @RequestParam String newEmail
    ) {
        String oldEmail = authentication.getName();
        User user = userService.getUserByEmail(oldEmail);

        user.setEmail(newEmail);
        User updated = userService.updateUser(user.getId(), user, null);

        // Generate a new token for updated email
        String newToken = jwtUtil.generateToken(updated.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(newToken, userService.toDTO(updated)));
    }
}
