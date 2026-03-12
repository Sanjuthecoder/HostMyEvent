package com.hostmyevent.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        // Load .env file into System properties BEFORE Spring context starts
        // so that @Value("${...}") placeholders in application.properties resolve
        // correctly.
        // ignoreIfMissing() ensures it works in CI/CD where real env vars are set
        // instead.
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        // Inject each .env entry into System properties
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(BackendApplication.class, args);
    }
}
