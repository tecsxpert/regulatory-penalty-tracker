package backend.config;

import backend.entity.Penalty;
import backend.repository.PenaltyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PenaltyRepository penaltyRepository;

    @Override
    public void run(String... args) throws Exception {

        // Only seed if table is empty
        if (penaltyRepository.count() > 0) return;

        List<Penalty> penalties = List.of(

            make("GST Late Filing Penalty", "Penalty for delayed GST return submission",
                "GST Department", 15000.00, "OPEN", LocalDate.of(2026, 5, 10)),

            make("Income Tax Non-Compliance", "Failure to file income tax on time",
                "Income Tax Dept", 25000.00, "OPEN", LocalDate.of(2026, 5, 15)),

            make("EPF Contribution Delay", "Late deposit of employee provident fund",
                "EPFO", 8000.00, "CLOSED", LocalDate.of(2026, 4, 20)),

            make("TDS Default Penalty", "Non-deduction of TDS at source",
                "Income Tax Dept", 12000.00, "OPEN", LocalDate.of(2026, 5, 25)),

            make("SEBI Disclosure Violation", "Failure to disclose shareholding pattern",
                "SEBI", 50000.00, "OPEN", LocalDate.of(2026, 6, 1)),

            make("RBI FEMA Violation", "Unauthorized foreign exchange transaction",
                "Reserve Bank of India", 75000.00, "CLOSED", LocalDate.of(2026, 4, 10)),

            make("Professional Tax Default", "Non-payment of professional tax",
                "State Tax Dept", 5000.00, "CLOSED", LocalDate.of(2026, 3, 31)),

            make("ESI Contribution Delay", "Late submission of ESI contributions",
                "ESIC", 9500.00, "OPEN", LocalDate.of(2026, 5, 20)),

            make("Customs Duty Evasion", "Under-declaration of import value",
                "Customs Dept", 120000.00, "OPEN", LocalDate.of(2026, 6, 15)),

            make("Companies Act Violation", "Non-filing of annual returns",
                "Ministry of Corporate Affairs", 30000.00, "CLOSED", LocalDate.of(2026, 4, 5)),

            make("Labour Law Non-Compliance", "Violation of minimum wage regulations",
                "Labour Dept", 18000.00, "OPEN", LocalDate.of(2026, 5, 30)),

            make("Environmental Compliance Failure", "Exceeding permitted emission limits",
                "Pollution Control Board", 200000.00, "OPEN", LocalDate.of(2026, 6, 20)),

            make("Shop Act Renewal Penalty", "Failure to renew shop establishment license",
                "Municipal Corporation", 3500.00, "CLOSED", LocalDate.of(2026, 3, 15)),

            make("Fire Safety Violation", "Non-compliance with fire safety norms",
                "Fire Department", 45000.00, "OPEN", LocalDate.of(2026, 5, 5)),

            make("Food License Expiry", "Operating with expired FSSAI license",
                "FSSAI", 22000.00, "CLOSED", LocalDate.of(2026, 4, 25))
        );

        penaltyRepository.saveAll(penalties);
        System.out.println("Seeded 15 demo penalties");
    }

    private Penalty make(String title, String description, String regulationBody,
                         Double amount, String status, LocalDate dueDate) {
        Penalty p = new Penalty();
        p.setTitle(title);
        p.setDescription(description);
        p.setRegulationBody(regulationBody);
        p.setAmount(amount);
        p.setStatus(status);
        p.setDueDate(dueDate);
        p.setIsDeleted(false);
        return p;
    }
}