package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.PasswordResetToken;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setId(1L);
        role.setName("USER");

        user = new User();
        user.setId(1L);
        user.setFullName("Admin");
        user.setEmail("admin@example.com");
        user.setPhone("1234567890");
        user.setIsActive(true);
        user.setRole(role);
    }

    @Test
    void testGetUserById_success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        assertEquals(user.getFullName(), result.getFullName());
    }

    @Test
    void testGetUserById_notFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(1L));
    }

    @Test
    void testGetUserByEmail_success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        User result = userService.getUserByEmail(user.getEmail());

        assertNotNull(result);
        assertEquals(user.getEmail(), result.getEmail());
    }

    @Test
    void testGetUserByEmail_notFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserByEmail("notfound@example.com"));
    }

    @Test
    void testCreatePasswordResetToken_success() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        String token = userService.createPasswordResetToken(user.getEmail());

        assertNotNull(token);
        verify(tokenRepository, times(1)).save(any(PasswordResetToken.class));
    }

    @Test
    void testResetPassword_success() {
        String rawPassword = "newPassword";
        String encodedPassword = "encodedPassword";

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));

        when(tokenRepository.findByToken(resetToken.getToken())).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);

        boolean result = userService.resetPassword(resetToken.getToken(), rawPassword);

        assertTrue(result);
        assertEquals(encodedPassword, user.getPasswordHash());
        verify(userRepository, times(1)).save(user);
        verify(tokenRepository, times(1)).delete(resetToken);
    }

    @Test
    void testResetPassword_tokenExpired() {
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().minusMinutes(10));

        when(tokenRepository.findByToken(resetToken.getToken())).thenReturn(Optional.of(resetToken));

        boolean result = userService.resetPassword(resetToken.getToken(), "newPassword");

        assertFalse(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testResetPassword_tokenNotFound() {
        when(tokenRepository.findByToken("fakeToken")).thenReturn(Optional.empty());

        boolean result = userService.resetPassword("fakeToken", "newPassword");

        assertFalse(result);
    }
}
