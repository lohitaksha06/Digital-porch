package com.example.digitalporch.blog.controller;

import com.example.digitalporch.blog.model.Blog;
import com.example.digitalporch.blog.repo.BlogRepository;
import com.example.digitalporch.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogRepository blogs;
    private final JwtUtil jwt;

    public BlogController(BlogRepository blogs, JwtUtil jwt) { this.blogs = blogs; this.jwt = jwt; }

    @GetMapping
    public List<Blog> all() {
        return blogs.findAll();
    }

    @GetMapping("/me")
    public List<Blog> myBlogs(@RequestHeader(value = "Authorization", required = false) String auth) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        return blogs.findByAuthorEmailOrderByCreatedAtDesc(email);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @RequestBody Map<String, String> body) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        Blog b = new Blog();
        b.setAuthorEmail(email);
        b.setTitle(body.getOrDefault("title", ""));
        b.setContent(body.getOrDefault("content", ""));
        b.setTags(body.getOrDefault("tags", ""));
        if (b.getTitle().isBlank()) throw new IllegalArgumentException("Title is required");
        blogs.save(b);
        return ResponseEntity.ok(b);
    }
}
