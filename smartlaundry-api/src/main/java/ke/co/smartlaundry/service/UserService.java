package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.RegisterRequestDTO;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.UserRepository;

import java.util.List;

public interface UserService {

    // --- DTO conversions ---
    UserDTO toDTO(User user);

    // --- Registration helpers ---
    User fromRegisterDTO(RegisterRequestDTO dto, Role role);
    User fromRegisterDTO(RegisterRequestDTO dto, Role role, String adminPasscode) throws IllegalArgumentException;

    // --- CRUD operations ---
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    User createUser(User user);
    User getUserByEmail(String email);
    User updateUser(Long id, User updatedUser, String roleName);
    void deleteUser(Long id);

    // --- Verification ---
    void markUserAsVerified(String email);

    // --- Password handling ---
    boolean checkPassword(String raw, String encoded);
    String encodePassword(String rawPassword);

    // --- Password reset ---
    String createPasswordResetToken(String email);
    boolean resetPassword(String token, String newPassword);

    // --- Utility methods ---
    User findUserByEmail(String email);
    User getUserFromToken(String token);
    UserRepository getUserRepository();
}
