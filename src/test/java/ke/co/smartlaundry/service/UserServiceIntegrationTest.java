package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.PasswordResetToken;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    // ============================
    // GET BY EMAIL
    // ============================
    @Test
    void getUserByEmail_ExistingUser() {
        User user = userService.getUserByEmail("customer1@laundromart.ke");

        assertNotNull(user);
        assertEquals("customer1@laundromart.ke", user.getEmail());
        assertTrue(user.getIsActive());
    }

    @Test
    void getUserByEmail_NonExistingUser_ShouldThrow() {
        assertThrows(NoSuchElementException.class,
                () -> userService.getUserByEmail("notfound@example.com"));
    }

    // ============================
    // CREATE USER
    // ============================
    @Test
    void createUser_Success() {
        Role role = roleRepository.findByName("CUSTOMER").orElseThrow();

        User newUser = new User();
        newUser.setUsername("Integration Test User");
        newUser.setEmail("intuser@example.com");
        newUser.setPasswordHash("secret");
        newUser.setStatus(User.Status.ACTIVE);
        newUser.setRole(role);

        User saved = userService.createUser(newUser);

        assertNotNull(saved.getId());
        assertEquals("Integration Test User", saved.getUsername());
        assertTrue(saved.getIsActive());
    }

    // ============================
    // UPDATE USER
    // ============================
    @Test
    void updateUser_Success() {
        User user = userService.getUserByEmail("customer1@laundromart.ke");
        user.setUsername("Updated Name");
        user.setPhone("+254700111999");

        // pass: id, updatedUser, and roleName (can be null if unchanged)
        User updated = userService.updateUser(user.getId(), user, null);

        assertEquals("Updated Name", updated.getUsername());
        assertEquals("+254700111999", updated.getPhone());
    }


    // ============================
    // DELETE USER
    // ============================
    @Test
    void deleteUser_Success() {
        User newUser = new User();
        newUser.setUsername("Delete Me");
        newUser.setEmail("delete.me@example.com");
        newUser.setPasswordHash("pass123");
        newUser.setStatus(User.Status.ACTIVE);
        newUser.setRole(roleRepository.findByName("CUSTOMER").orElseThrow());

        User saved = userService.createUser(newUser);
        Long id = saved.getId();

        userService.deleteUser(id);

        assertFalse(userRepository.findById(id).isPresent());
    }

    // ============================
    // PASSWORD CHECK
    // ============================
    @Test
    void checkPassword_ShouldValidateCorrectly() {
        User user = new User();
        user.setUsername("Pass Tester");
        user.setEmail("passtest@example.com");
        user.setPasswordHash(userService.encodePassword("mypassword"));
        user.setStatus(User.Status.ACTIVE);
        user.setRole(roleRepository.findByName("CUSTOMER").orElseThrow());

        User saved = userService.createUser(user);

        assertTrue(userService.checkPassword("mypassword", saved.getPasswordHash()));
        assertFalse(userService.checkPassword("wrongpass", saved.getPasswordHash()));
    }

    // ============================
    // PASSWORD RESET FLOW
    // ============================
    @Test
    void createPasswordResetToken_ShouldGenerateToken() {
        User user = userService.getUserByEmail("customer1@laundromart.ke");

        String token = userService.createPasswordResetToken(user.getEmail());

        assertNotNull(token);

        PasswordResetToken savedToken = tokenRepository.findByToken(token).orElse(null);
        assertNotNull(savedToken);
        assertEquals(user.getId(), savedToken.getUser().getId());
    }

    @Test
    void resetPassword_WithValidToken_ShouldUpdatePassword() {
        User user = userService.getUserByEmail("customer1@laundromart.ke");

        String token = userService.createPasswordResetToken(user.getEmail());

        boolean success = userService.resetPassword(token, "newSecret123");
        assertTrue(success);

        User updated = userService.getUserByEmail(user.getEmail());
        assertTrue(userService.checkPassword("newSecret123", updated.getPasswordHash()));

        // token should be deleted after use
        assertTrue(tokenRepository.findByToken(token).isEmpty());
    }

    @Test
    void resetPassword_WithInvalidToken_ShouldFail() {
        boolean result = userService.resetPassword("invalid-token", "somePass");
        assertFalse(result);
    }
}
