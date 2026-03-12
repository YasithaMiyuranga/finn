package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.ViolationPointsConfigDTO;
import com.Traffic_Fines.System.Entity.ViolationPointsConfig;
import com.Traffic_Fines.System.Entity.ViolationType;
import com.Traffic_Fines.System.Repository.ViolationPointsConfigRepo;
import com.Traffic_Fines.System.Repository.ViolationTypeRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ViolationPointsConfigService {

    @Autowired
    private ViolationPointsConfigRepo configRepo;

    @Autowired
    private ViolationTypeRepo violationTypeRepo;

    public Respons saveConfig(ViolationPointsConfigDTO dto) {
        ViolationType violationType = violationTypeRepo.findById(dto.getViolationTypeId());
        if (violationType == null) {
            return new Respons<>(false, "Invalid violation type ID", null);
        }

        ViolationPointsConfig config = new ViolationPointsConfig();
        config.setPoints(dto.getPoints());
        config.setSeverityLevel(ViolationPointsConfig.SeverityLevel.valueOf(dto.getSeverityLevel()));
        config.setDescription(dto.getDescription());
        config.setViolationType(violationType);

        ViolationPointsConfig saved = configRepo.save(config);
        return new Respons<>(true, "Configuration saved successfully", saved.getId());
    }

    public Respons getAllConfigs() {
        List<ViolationPointsConfig> configs = configRepo.findAll();
        return new Respons<>(true, "Configurations retrieved", configs);
    }

    public Respons getPointsForViolation(int violationTypeId) {
        var config = configRepo.findByViolationTypeId(violationTypeId);
        if (config.isEmpty()) {
            return new Respons<>(false, "No configuration found for this violation type", null);
        }
        return new Respons<>(true, "Configuration found", config.get());
    }

    public Respons updateConfig(int configId, ViolationPointsConfigDTO dto) {
        ViolationPointsConfig config = configRepo.findById(configId);
        if (config == null) {
            return new Respons<>(false, "Invalid config ID", null);
        }

        config.setPoints(dto.getPoints());
        config.setSeverityLevel(ViolationPointsConfig.SeverityLevel.valueOf(dto.getSeverityLevel()));
        config.setDescription(dto.getDescription());

        ViolationPointsConfig saved = configRepo.save(config);
        return new Respons<>(true, "Configuration updated", saved.getId());
    }
}
