package com.hostmyevent.backend.repository;

import com.hostmyevent.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(String status);

    List<Event> findByStatusOrderByStartDateAsc(String status);

    List<Event> findByOrganizer_Id(Long organizerId);

    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :searchParam, '%')) OR LOWER(e.locationCity) LIKE LOWER(CONCAT('%', :searchParam, '%'))")
    List<Event> searchEvents(String searchParam);

    List<Event> findByCategory(String category);
}
