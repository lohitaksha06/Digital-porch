package com.example.digitalporch.auth.controller;

import com.example.digitalporch.auth.model.User;
import com.example.digitalporch.auth.repo.UserRepository;
import com.example.digitalporch.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository users;
    private final JwtUtil jwt;
    private final PasswordEncoder encoder;

    public UserController(UserRepository users, JwtUtil jwt, PasswordEncoder encoder) { this.users = users; this.jwt = jwt; this.encoder = encoder; }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        User u = users.findByEmail(email).orElseThrow(() -> new RuntimeException("Unauthorized"));
        return ResponseEntity.ok(Map.of(
                "name", u.getName(),
                "email", u.getEmail(),
                "avatarUrl", u.getAvatarUrl(),
                "about", u.getAbout(),
                "gender", u.getGender(),
                "preferences", u.getPreferences()
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestHeader(value = "Authorization", required = false) String auth,
                                      @RequestBody Map<String, String> body) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        User u = users.findByEmail(email).orElseThrow(() -> new RuntimeException("Unauthorized"));
        if (body.containsKey("name")) u.setName(body.get("name"));
        if (body.containsKey("avatarUrl")) u.setAvatarUrl(body.get("avatarUrl"));
        if (body.containsKey("about")) u.setAbout(body.get("about"));
        if (body.containsKey("gender")) u.setGender(body.get("gender"));
        if (body.containsKey("preferences")) u.setPreferences(body.get("preferences"));
        users.save(u);
        return ResponseEntity.ok(Map.of("status", "updated"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader(value = "Authorization", required = false) String auth,
                                            @RequestBody Map<String, String> body) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        User u = users.findByEmail(email).orElseThrow(() -> new RuntimeException("Unauthorized"));
        String current = body.getOrDefault("currentPassword", "");
        String next = body.getOrDefault("newPassword", "");
        if (next.length() < 6) throw new IllegalArgumentException("Password too short");
        if (!encoder.matches(current, u.getPasswordHash())) throw new IllegalArgumentException("Current password incorrect");
        u.setPasswordHash(encoder.encode(next));
        users.save(u);
        return ResponseEntity.ok(Map.of("status", "password_changed"));
    }
}
