package org.example.donatehub.service;

import java.util.List;

import org.example.donatehub.entity.User;
import org.example.donatehub.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Get the list from your repository
        List<User> users = userRepository.findByEmail(email);

        // 2. Use stream to find the first user or throw exception if the list is empty
        User user = users.stream()
                .findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(false) // Don't block login based on Enable status; handle approval logic in controller
                .build();
    }

}
