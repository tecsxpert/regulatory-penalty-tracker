package backend.aop;

import backend.entity.AuditLog;
import backend.repository.AuditLogRepository;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @AfterReturning("execution(* backend.service.PenaltyService.createPenalty(..))")
    public void logCreate() { save("CREATE"); }

    @AfterReturning("execution(* backend.service.PenaltyService.updatePenalty(..))")
    public void logUpdate() { save("UPDATE"); }

    @AfterReturning("execution(* backend.service.PenaltyService.deletePenalty(..))")
    public void logDelete() { save("DELETE"); }

    private void save(String action) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType("Penalty");
        auditLogRepository.save(log);
    }
}
