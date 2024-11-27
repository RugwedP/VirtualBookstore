package com.myBookStoreProject.rugwedBookstore.Securiy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private UserDetailsService userDetailsService;

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//    	 return http
//    		        .cors()  // Enable CORS for cross-origin requests
//    		        .and()
//    		        .csrf(csrf -> csrf.disable())  // Disable CSRF (typically needed for stateless APIs)
//    		        .authorizeHttpRequests(auth -> auth
//    		            // Publicly accessible endpoints
//    		            .requestMatchers(
//    		                "/api/user/category/**",
//    		                "/images/**",
//    		                "/api/user/**",
//    		                "/api/book/**",
//    		                "/login",
//    		                "/addUser"
//    		            ).permitAll()
//    		            // All other endpoints require authentication
//    		            .anyRequest().authenticated()
//    		        )
//    		        // Remove Basic Authentication to avoid login popup
//    		        .httpBasic(httpBasic -> httpBasic.disable())
//    		        // Use JWT filter for authentication
//    		        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//    		        // Stateless session management for JWT-based authentica
//    		        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//    		        .build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors()
            .and()
            .csrf(customizer -> customizer.disable())
            .authorizeHttpRequests(request -> request
                // Ensure your API endpoints are properly matched and excluded from authentication
                .requestMatchers("/api/user/category/**","/images/**","/api/admin/**", "/api/user/**","/api/cart/**","https://api.postalpincode.in/pincode/**","/api/book/**", "/login", "/addUser").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }




    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        provider.setUserDetailsService(userDetailsService);


        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();

    }


}
