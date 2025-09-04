package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.UserDTO;
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
        User userDTO = userRepository.findByEmail(email)
                .orElseThrow();
        return org.springframework.security.core.userdetails.User.builder()
                .username(userDTO.getEmail())
                .password(userDTO.getPasswordHash())
                .roles(userDTO.getRole().getName())
                .disabled(!userDTO.getIsActive())
                .build();
    }
}
