package com.example.digitalporch.auth.controller;

import com.example.digitalporch.auth.dto.AuthResponse;
import com.example.digitalporch.auth.dto.LoginRequest;
import com.example.digitalporch.auth.dto.SignupRequest;
import com.example.digitalporch.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Validated @RequestBody SignupRequest req) {
        return ResponseEntity.ok(auth.signup(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Validated @RequestBody LoginRequest req) {
        return ResponseEntity.ok(auth.login(req));
    }
}
