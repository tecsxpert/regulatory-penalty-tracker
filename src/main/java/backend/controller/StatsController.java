package backend.controller;

import backend.config.ApiResponse;
import backend.entity.Penalty;
import backend.service.PenaltyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/penalties")
public class StatsController {

    @Autowired
    private PenaltyService penaltyService;

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getStats() {
        List<Penalty> all = penaltyService.getAllPenalties();

        long open   = all.stream().filter(p -> "OPEN".equals(p.getStatus())).count();
        long closed = all.stream().filter(p -> "CLOSED".equals(p.getStatus())).count();
        double totalAmount = all.stream()
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0)
            .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", all.size());
        stats.put("open", open);
        stats.put("closed", closed);
        stats.put("totalAmount", totalAmount);

        return new ApiResponse<>("Stats fetched", stats);
    }
}
