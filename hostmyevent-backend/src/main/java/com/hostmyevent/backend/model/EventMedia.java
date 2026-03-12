package com.hostmyevent.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_media")
@Data
public class EventMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    private Event event;

    @Column(nullable = false)
    private String mediaUrl; // The IPFS hash/gateway URL from Pinata

    @Column(nullable = false)
    private String mediaType; // IMAGE or VIDEO

    private LocalDateTime uploadedAt = LocalDateTime.now();
}
