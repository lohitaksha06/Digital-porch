package com.example.digitalporch.auth.service;

import com.example.digitalporch.auth.dto.AuthResponse;
import com.example.digitalporch.auth.dto.LoginRequest;
import com.example.digitalporch.auth.dto.SignupRequest;
import com.example.digitalporch.auth.model.User;
import com.example.digitalporch.auth.repo.UserRepository;
import com.example.digitalporch.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (users.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPasswordHash(encoder.encode(req.getPassword()));
        users.save(u);
        String token = jwt.generateToken(u.getEmail());
        return new AuthResponse(token, u.getName(), u.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        User u = users.findByEmail(req.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwt.generateToken(u.getEmail());
        return new AuthResponse(token, u.getName(), u.getEmail());
    }
}
