package backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PenaltyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllReturns200() throws Exception {
        mockMvc.perform(get("/api/penalties/all"))
            .andExpect(status().isOk());
    }

    @Test
    void getByIdNotFoundReturns404() throws Exception {
        mockMvc.perform(get("/api/penalties/9999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createWithNoBodyReturns400() throws Exception {
        mockMvc.perform(post("/api/penalties/create")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void searchReturns200() throws Exception {
        mockMvc.perform(get("/api/penalties/search?q=test"))
            .andExpect(status().isOk());
    }

    @Test
    void statsReturns200() throws Exception {
        mockMvc.perform(get("/api/penalties/stats"))
            .andExpect(status().isOk());
    }
}
