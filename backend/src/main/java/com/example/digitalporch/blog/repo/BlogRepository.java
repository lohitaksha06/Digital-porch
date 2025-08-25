package com.example.digitalporch.blog.repo;

import com.example.digitalporch.blog.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);
    List<Blog> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String query);
}
