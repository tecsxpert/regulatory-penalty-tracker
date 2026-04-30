package backend.controller;

import backend.config.ApiResponse;
import backend.entity.Penalty;
import backend.service.PenaltyService;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ExportUploadController {

    @Autowired
    private PenaltyService penaltyService;

    @GetMapping("/export")
    public void exportCsv(HttpServletResponse response) throws Exception {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=penalties.csv");

        List<Penalty> list = penaltyService.getAllPenalties();
        PrintWriter writer = response.getWriter();
        writer.println("id,title,status,amount");
        for (Penalty p : list) {
            writer.println(p.getId() + "," + p.getTitle() + ","
                + p.getStatus() + "," + p.getAmount());
        }
    }

    @PostMapping("/upload")
    public ApiResponse<String> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty())
            return new ApiResponse<>("File is empty", null);

        String type = file.getContentType();
        if (!"text/csv".equals(type) && !"application/vnd.ms-excel".equals(type))
            return new ApiResponse<>("Only CSV files allowed", null);

        if (file.getSize() > 2 * 1024 * 1024)
            return new ApiResponse<>("File too large. Max 2MB", null);

        return new ApiResponse<>("Uploaded successfully", file.getOriginalFilename());
    }
}
