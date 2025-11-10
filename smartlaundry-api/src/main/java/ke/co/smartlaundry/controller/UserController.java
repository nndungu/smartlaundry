package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.LoginResponseDTO;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.security.JwtUtil;
import ke.co.smartlaundry.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ----------------------------
    // Self-service profile
    // ----------------------------

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile(@RequestHeader("Authorization") String token) {
        User user = userService.getUserFromToken(token);
        return ResponseEntity.ok(userService.toDTO(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@RequestHeader("Authorization") String token,
                                                 @RequestBody UserDTO dto) {
        User user = userService.getUserFromToken(token);
        user.setUsername(dto.getUsername());
        user.setPhoneNumber(dto.getPhoneNumber());
        User updated = userService.updateUser(user.getId(), user, null);
        return ResponseEntity.ok(userService.toDTO(updated));
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String token,
                                                 @RequestParam String oldPassword,
                                                 @RequestParam String newPassword) {
        User user = userService.getUserFromToken(token);
        if (!userService.checkPassword(oldPassword, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }
        user.setPasswordHash(userService.encodePassword(newPassword));
        userService.updateUser(user.getId(), user, null);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/me/change-email")
    public ResponseEntity<LoginResponseDTO> changeEmail(@RequestHeader("Authorization") String token,
                                                        @RequestParam String newEmail) {
        User user = userService.getUserFromToken(token);
        user.setEmail(newEmail);
        User updated = userService.updateUser(user.getId(), user, null);
        String newToken = jwtUtil.generateToken(updated.getEmail());
        return ResponseEntity.ok(new LoginResponseDTO(newToken, userService.toDTO(updated)));
    }
}
