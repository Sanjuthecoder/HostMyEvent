package com.hostmyevent.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(nullable = false)
    private String venueName;

    private String address;
    private String locationCity;

    @Column(nullable = false)
    private String ticketType; // "FREE" or "PAID"

    private Double price;
    private Integer capacity;

    private String organizerEmail;
    private String organizerPhone;

    // @JsonIgnore prevents the circular reference Event -> User -> events
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    // Convenience field so the frontend can show the organizer's name without full
    // User object
    @Transient
    @JsonIgnore
    public String getOrganizerName() {
        return organizer != null ? organizer.getFullName() : null;
    }

    @Transient
    public Long getOrganizerId() {
        return organizer != null ? organizer.getId() : null;
    }

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<EventMedia> media = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Status: ACTIVE, CANCELLED, COMPLETED
    private String status = "ACTIVE";

    @Column(name = "likes_count")
    private Long likesCount = 0L;

    @Column(name = "shares_count")
    private Long sharesCount = 0L;
}
