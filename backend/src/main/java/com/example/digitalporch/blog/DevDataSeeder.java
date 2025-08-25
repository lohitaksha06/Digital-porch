package com.example.digitalporch.blog;

import com.example.digitalporch.blog.model.Blog;
import com.example.digitalporch.blog.repo.BlogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DevDataSeeder implements CommandLineRunner {
    private final BlogRepository blogs;

    public DevDataSeeder(BlogRepository blogs) { this.blogs = blogs; }

    @Override
    public void run(String... args) {
        if (blogs.count() > 0) return;
        Blog b1 = new Blog();
        b1.setTitle("The Art of Storytelling");
        b1.setContent("Discover how to captivate your audience with compelling narratives. This is a demo post.");
        b1.setTags("featured,writing,creativity");
        b1.setAuthorEmail("demo@digitalporch.dev");

        Blog b2 = new Blog();
        b2.setTitle("A Developer's Journey");
        b2.setContent("From Hello World to scalable apps — a tale of perseverance. This is a demo post.");
        b2.setTags("dev,tips,journey");
        b2.setAuthorEmail("demo@digitalporch.dev");

        Blog b3 = new Blog();
        b3.setTitle("Mindfulness in the Digital Age");
        b3.setContent("Finding balance and focus in a world of constant distractions. This is a demo post.");
        b3.setTags("life,focus,wellness");
        b3.setAuthorEmail("demo@digitalporch.dev");

        blogs.save(b1);
        blogs.save(b2);
        blogs.save(b3);
    }
}