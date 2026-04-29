package backend.service;
import backend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.entity.Penalty;
import backend.repository.PenaltyRepository;

@Service
public class PenaltyService {

    @Autowired
    private PenaltyRepository repository;

    // CREATE
    public Penalty createPenalty(Penalty penalty) {
        return repository.save(penalty);
    }

    // GET ALL
    public List<Penalty> getAllPenalties() {
        return repository.findAll();
    }

    // GET BY ID
    public Penalty getPenaltyById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Penalty not found"));
    }

    // DELETE
    public void deletePenalty(Long id) {
        repository.deleteById(id);
    }
    public Penalty updatePenalty(Long id, Penalty updatedPenalty) {
        Penalty existing = repository.findById(id)
        		.orElseThrow(() -> new ResourceNotFoundException("Penalty not found"));
        existing.setTitle(updatedPenalty.getTitle());
        existing.setDescription(updatedPenalty.getDescription());
        existing.setAmount(updatedPenalty.getAmount());
        existing.setStatus(updatedPenalty.getStatus());

        return repository.save(existing);
    }
    public Page<Penalty> getAllPenalties(Pageable pageable) {
        return repository.findAll(pageable);
    }
    public List<Penalty> searchByTitle(String title) {
        return repository.findByTitleContainingIgnoreCase(title);
    }
}