/*
package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

class UserServiceUnitTest {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordResetTokenRepository tokenRepository;
    private PasswordEncoder passwordEncoder;
    private UserServiceImpl userService;

    @BeforeEach
    void setup() {
        userRepository = Mockito.mock(UserRepository.class);
        roleRepository = Mockito.mock(RoleRepository.class);
        tokenRepository = Mockito.mock(PasswordResetTokenRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        userService = new UserServiceImpl(userRepository, roleRepository, tokenRepository, passwordEncoder);
    }

    @Test
    void createUser_shouldEncodePasswordAndSave() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("plain123");

        Mockito.when(passwordEncoder.encode("plain123")).thenReturn("encoded123");
        Mockito.when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.createUser(user);

        assertThat(saved.getPasswordHash()).isEqualTo("encoded123");
        Mockito.verify(userRepository).save(Mockito.any(User.class));
    }

    @Test
    void getUserByEmail_shouldReturnUser() {
        User user = new User();
        user.setEmail("found@example.com");
        Mockito.when(userRepository.findByEmail("found@example.com")).thenReturn(Optional.of(user));

        User found = userService.getUserByEmail("found@example.com");
        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo("found@example.com");
    }

    @Test
    void getUserByEmail_shouldThrowIfMissing() {
        Mockito.when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByEmail("missing@example.com"))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void checkPassword_shouldDelegateToEncoder() {
        Mockito.when(passwordEncoder.matches("raw", "encoded")).thenReturn(true);

        boolean result = userService.checkPassword("raw", "encoded");
        assertThat(result).isTrue();
        Mockito.verify(passwordEncoder).matches("raw", "encoded");
    }
}
*/
