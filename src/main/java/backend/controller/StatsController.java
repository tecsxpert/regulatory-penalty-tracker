package backend.controller;

import backend.config.ApiResponse;
import backend.repository.PenaltyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/penalties")
public class StatsController {

    @Autowired
    private PenaltyRepository repository;

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getStats() {

        // Single DB query instead of 4 separate calls — fixes N+1
        List<Object[]> result = repository.fetchStatsInOneQuery();
        Object[] row = result.get(0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total",       row[0] != null ? ((Number) row[0]).longValue()   : 0);
        stats.put("open",        row[1] != null ? ((Number) row[1]).longValue()   : 0);
        stats.put("closed",      row[2] != null ? ((Number) row[2]).longValue()   : 0);
        stats.put("totalAmount", row[3] != null ? ((Number) row[3]).doubleValue() : 0.0);

        return new ApiResponse<>("Stats fetched", stats);
    }
}