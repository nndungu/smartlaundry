package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.dto.RegisterRequestDTO;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    public UserController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
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
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid RegisterRequestDTO dto) {
        String roleName = dto.getRoleName() != null ? dto.getRoleName() : "USER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new NoSuchElementException("Role not found"));

        User user = userService.fromRegisterDTO(dto, role);
        user = userService.createUser(user);

        return ResponseEntity.ok(userService.toDTO(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody @Valid RegisterRequestDTO dto) {
        try {
            String roleName = dto.getRoleName() != null ? dto.getRoleName() : null;
            User user = userService.fromRegisterDTO(dto, null); // role handled in service.updateUser
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
}
