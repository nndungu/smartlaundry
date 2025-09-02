package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.dto.RegisterRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder; // <-- interface

    @Autowired
    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordResetTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder) { // <-- interface
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- DTO Conversions ---
    public UserDTO toDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setIsActive(user.getIsActive());
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : null);
        return dto;
    }

    public User fromRegisterDTO(RegisterRequestDTO dto, Role role) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setIsActive(true);
        return user;
    }

    // --- CRUD ---
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public UserDTO getUserById(Long id) {
        return toDTO(userRepository.findById(id).orElseThrow());
    }

    public User createUser(User user) { return userRepository.save(user); }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    // --- Password Reset ---
    public String createPasswordResetToken(String email) {
        User user = getUserByEmail(email);
        tokenRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .forEach(tokenRepository::delete);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));

        tokenRepository.save(resetToken);
        return token;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isPresent()) {
            PasswordResetToken resetToken = tokenOpt.get();
            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) return false;
            User user = resetToken.getUser();
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            tokenRepository.delete(resetToken);
            return true;
        }
        return false;
    }

    public boolean checkPassword(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }

    public User updateUser(Long id, User user, String roleName) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        // Update basic fields
        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());

        // Update role if provided
        if (roleName != null) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new NoSuchElementException("Role not found"));
            existingUser.setRole(role);
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
        userRepository.delete(user);
    }
}
