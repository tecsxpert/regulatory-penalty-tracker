package backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ✅ HANDLE RESOURCE NOT FOUND (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {

        Map<String, Object> response = new HashMap<>();
        response.put("message", ex.getMessage());
        response.put("status", 404);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // ✅ HANDLE VALIDATION ERRORS (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, Object> response = new HashMap<>();

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .toList();

        response.put("errors", errors);
        response.put("status", 400);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}