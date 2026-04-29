package backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import backend.entity.Penalty;
import java.util.List;


public interface PenaltyRepository extends JpaRepository<Penalty, Long> {
	List<Penalty> findByTitleContainingIgnoreCase(String title);
}

