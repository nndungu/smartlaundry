package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.RegisterRequestDTO;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.model.PasswordResetToken;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordResetTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder) {
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
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive()); // ✅ use enum-based method
        return dto;
    }

    public User fromRegisterDTO(RegisterRequestDTO dto, Role role) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(role);
        user.setStatus(User.Status.ACTIVE); // ✅ enum
        return user;
    }

    // --- CRUD ---
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    public UserDTO getUserById(Long id) {
        return toDTO(userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found")));
    }

    public User createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash())); // encode before save
        if (user.getStatus() == null) {
            user.setStatus(User.Status.ACTIVE); // default
        }
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public User updateUser(Long id, User updatedUser, String roleName) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        existing.setUsername(updatedUser.getUsername());
        existing.setPhone(updatedUser.getPhone());
        existing.setEmail(updatedUser.getEmail());

        if (updatedUser.getPasswordHash() != null && !updatedUser.getPasswordHash().isEmpty()) {
            existing.setPasswordHash(passwordEncoder.encode(updatedUser.getPasswordHash()));
        }

        if (roleName != null) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new NoSuchElementException("Role not found"));
            existing.setRole(role);
        }

        if (updatedUser.getStatus() != null) {
            existing.setStatus(updatedUser.getStatus()); // update enum
        }

        return userRepository.save(existing);
    }

    public void markUserAsVerified(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // --- Passwords ---
    public boolean checkPassword(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    // --- Reset password ---
    public String createPasswordResetToken(String email) {
        User user = getUserByEmail(email);

        // delete old tokens
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

    public User findUserByEmail(String mail) {
        return null;
    }

    public User registerUser(User user) {
        return user;
    }

    public Object authenticateUser(String mail, String password) {
        return null;
    }
}
