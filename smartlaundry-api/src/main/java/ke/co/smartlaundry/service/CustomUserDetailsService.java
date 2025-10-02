package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())                  // login username/email
                .password(user.getPasswordHash())           // use hashed password
                .roles(user.getRole().getName())            // role name e.g., ADMIN, USER
                .disabled(!user.getIsActive())              // disable if inactive
                .build();
    }
}
