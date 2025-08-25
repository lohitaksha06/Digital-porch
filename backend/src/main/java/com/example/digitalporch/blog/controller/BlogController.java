package com.example.digitalporch.blog.controller;

import com.example.digitalporch.blog.model.Blog;
import com.example.digitalporch.blog.repo.BlogRepository;
import com.example.digitalporch.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    @GetMapping("/search")
    public List<Blog> search(@RequestParam("q") String q) {
        if (q == null || q.trim().isEmpty()) return List.of();
        return blogs.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(q.trim());
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
    b.setImageUrl(body.getOrDefault("imageUrl", null));
        if (b.getTitle().isBlank()) throw new IllegalArgumentException("Title is required");
        blogs.save(b);
        return ResponseEntity.ok(b);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id,
                                    @RequestBody Map<String, String> body) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        Optional<Blog> opt = blogs.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Blog b = opt.get();
        if (!email.equals(b.getAuthorEmail())) return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        String title = body.getOrDefault("title", b.getTitle());
        if (title.isBlank()) throw new IllegalArgumentException("Title is required");
        b.setTitle(title);
        b.setContent(body.getOrDefault("content", b.getContent()));
    b.setTags(body.getOrDefault("tags", b.getTags()));
    b.setImageUrl(body.getOrDefault("imageUrl", b.getImageUrl()));
        blogs.save(b);
        return ResponseEntity.ok(b);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id) {
        String email = jwt.getSubjectFromBearer(auth).orElseThrow(() -> new RuntimeException("Unauthorized"));
        Optional<Blog> opt = blogs.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Blog b = opt.get();
        if (!email.equals(b.getAuthorEmail())) return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        blogs.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
