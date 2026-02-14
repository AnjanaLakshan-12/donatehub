package org.example.donatehub.security;



import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;




@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disabled for the assignment
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .securityContext(context -> context
                        .securityContextRepository(new HttpSessionSecurityContextRepository()) // Persist auth to session
                )
                .authorizeHttpRequests(auth -> auth
                        // 1. Allow everyone to try to login or register or contact us
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/v1/users/add", "/api/contact/submit").permitAll()
                        
                        // 2. Donation Request endpoints - organization access
                        .requestMatchers("/api/v1/donationrequest/user/**").hasRole("ORG")
                        .requestMatchers("/api/v1/donationrequest/submit/**").hasRole("ORG")
                        .requestMatchers("/api/v1/donationrequest/*/action").hasAnyRole("DONOR", "ADMIN")
                        .requestMatchers("/api/v1/donationrequest/**").hasAnyRole("ADMIN", "DONOR", "ORG")

                        // 3. Role-Based Protection
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/donations/**").hasAnyRole("DONOR", "ADMIN")
                        .requestMatchers("/api/requests/**").hasAnyRole("ORG", "ADMIN")

                        // 4. Everything else requires a valid session
                        .anyRequest().authenticated()
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .deleteCookies("JSESSIONID") // Clears the cookie on logout
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                        })
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
