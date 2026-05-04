package backend.controller;

import backend.config.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private RestTemplate restTemplate;

    private final String FLASK_URL = "http://localhost:5000/describe";

    @PostMapping("/describe")
    public ApiResponse<Object> describe(@RequestBody Map<String, String> body) {
        try {
            Object response = restTemplate.postForObject(
                FLASK_URL,
                body,
                Object.class
            );

            return new ApiResponse<>("AI response fetched", response);

        } catch (Exception e) {
            return new ApiResponse<>("AI service unavailable", null);
        }
    }
}
