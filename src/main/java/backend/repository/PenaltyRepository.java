package backend.repository;

import backend.entity.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PenaltyRepository extends JpaRepository<Penalty, Long> {

    List<Penalty> findByTitleContainingIgnoreCase(String title);

    // Add these below
    List<Penalty> findByIsDeletedFalse();

    Page<Penalty> findByIsDeletedFalse(Pageable pageable);

    // Single query for stats — fixes N+1
    @Query("""
        SELECT
            COUNT(p),
            SUM(CASE WHEN p.status = 'OPEN'   THEN 1 ELSE 0 END),
            SUM(CASE WHEN p.status = 'CLOSED' THEN 1 ELSE 0 END),
            SUM(COALESCE(p.amount, 0))
        FROM Penalty p
        WHERE p.isDeleted = false
    """)
    List<Object[]> fetchStatsInOneQuery();

    // Search only non-deleted
    @Query("SELECT p FROM Penalty p WHERE p.isDeleted = false " +
           "AND LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Penalty> searchByTitleActive(String title);
}