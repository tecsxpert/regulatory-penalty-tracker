package backend.entity;

import jakarta.persistence.*;

@Entity
public class Penalty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double amount;
    private String status;

    // GETTERS
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Double getAmount() { return amount; }
    public String getStatus() { return status; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setStatus(String status) { this.status = status; }
}