package com.hostmyevent.backend.controller;

import com.hostmyevent.backend.model.Event;
import com.hostmyevent.backend.model.EventMedia;
import com.hostmyevent.backend.model.User;
import com.hostmyevent.backend.repository.EnrollmentRepository;
import com.hostmyevent.backend.repository.EventRepository;
import com.hostmyevent.backend.repository.UserRepository;
import com.hostmyevent.backend.model.Enrollment;
import com.hostmyevent.backend.service.PinataService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PinataService pinataService;
    private final EnrollmentRepository enrollmentRepository;

    public EventController(EventRepository eventRepository, UserRepository userRepository,
            PinataService pinataService, EnrollmentRepository enrollmentRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.pinataService = pinataService;
        this.enrollmentRepository = enrollmentRepository;
    }

    // --- PUBLIC ENDPOINTS --- //

    @GetMapping("/public/all")
    public ResponseEntity<List<Event>> getAllActiveEvents() {
        return ResponseEntity.ok(eventRepository.findByStatusOrderByStartDateAsc("ACTIVE"));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String query) {
        return ResponseEntity.ok(eventRepository.searchEvents(query));
    }

    // --- SECURED ENDPOINTS --- //

    @PostMapping("/host")
    public ResponseEntity<?> createEvent(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam("venueName") String venueName,
            @RequestParam("address") String address,
            @RequestParam("locationCity") String locationCity,
            @RequestParam("ticketType") String ticketType,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "capacity", required = false) Integer capacity,
            @RequestParam("organizerEmail") String organizerEmail,
            @RequestParam("organizerPhone") String organizerPhone,
            @RequestParam(value = "mediaFiles", required = false) MultipartFile[] mediaFiles,
            Authentication authentication) {
        try {
            // Get current logged-in user
            String email = authentication.getName();
            User organizer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated User not found"));

            Event event = new Event();
            event.setTitle(title);
            event.setCategory(category);
            event.setDescription(description);
            event.setStartDate(startDate);
            event.setEndDate(endDate);
            event.setVenueName(venueName);
            event.setAddress(address);
            event.setLocationCity(locationCity);
            event.setTicketType(ticketType);
            event.setPrice(price != null ? price : 0.0);
            event.setCapacity(capacity);
            event.setOrganizerEmail(organizerEmail);
            event.setOrganizerPhone(organizerPhone);
            event.setOrganizer(organizer);

            // Process Media Files
            if (mediaFiles != null && mediaFiles.length > 0) {
                for (MultipartFile file : mediaFiles) {
                    if (!file.isEmpty()) {
                        String ipfsUrl = pinataService.uploadFile(file);

                        EventMedia media = new EventMedia();
                        media.setEvent(event);
                        media.setMediaUrl(ipfsUrl);

                        String contentType = file.getContentType();
                        media.setMediaType(contentType != null && contentType.startsWith("video/") ? "VIDEO" : "IMAGE");

                        event.getMedia().add(media);
                    }
                }
            }

            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create event: " + e.getMessage());
        }
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<Event>> getMyHostedEvents(Authentication authentication) {
        String email = authentication.getName();
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated User not found"));

        return ResponseEntity.ok(eventRepository.findByOrganizer_Id(organizer.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody Event eventDetails,
            Authentication authentication) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check Authorization: Admin or Owner
        if (!user.getRole().equals("ROLE_ADMIN") && !event.getOrganizer().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to edit this event.");
        }

        event.setTitle(eventDetails.getTitle());
        event.setCategory(eventDetails.getCategory());
        event.setDescription(eventDetails.getDescription());
        event.setVenueName(eventDetails.getVenueName());
        event.setLocationCity(eventDetails.getLocationCity());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setPrice(eventDetails.getPrice());
        event.setOrganizerEmail(eventDetails.getOrganizerEmail());
        event.setOrganizerPhone(eventDetails.getOrganizerPhone());

        Event updatedEvent = eventRepository.save(event);
        return ResponseEntity.ok(updatedEvent);
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<?> enrollInEvent(@PathVariable Long id, Authentication authentication) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (enrollmentRepository.existsByUserIdAndEventId(user.getId(), event.getId())) {
            return ResponseEntity.badRequest().body("You are already enrolled in this event.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setEvent(event);
        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok("Successfully enrolled in the event.");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setLikesCount(event.getLikesCount() + 1);
        eventRepository.save(event);
        return ResponseEntity.ok(event.getLikesCount());
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setSharesCount(event.getSharesCount() + 1);
        eventRepository.save(event);
        return ResponseEntity.ok(event.getSharesCount());
    }
}
