package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Dto.ViolationTypeDTO;
import com.Traffic_Fines.System.Entity.ViolationType;
import com.Traffic_Fines.System.Repository.ViolationTypeRepo;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ViolationTypeService {
    @Autowired
    private ViolationTypeRepo violationTypeRepo;
    @Autowired
    private ModelMapper modelMapper;

    public Respons<Integer> saveViolationType(ViolationTypeDTO violationTypeDTO) {

        ViolationType violationType = new ViolationType();

        violationType.setViolationDescription(violationTypeDTO.getViolationDescription());
        violationType.setSlLawReference(violationTypeDTO.getSlLawReference());
        violationType.setAmount(violationTypeDTO.getAmount());
        violationType.setPoints(violationTypeDTO.getPoints());
        
        if (violationTypeDTO.getSeverityLevel() != null) {
            violationType.setSeverityLevel(ViolationType.SeverityLevel.valueOf(violationTypeDTO.getSeverityLevel().toUpperCase()));
        }

        ViolationType savedViolationType = violationTypeRepo.save(violationType);

        return new Respons<>(true, "violation Type add", savedViolationType.getId());
    }

    public List<ViolationType> getAllViolationType(){
        List<ViolationType>violationTypeList=violationTypeRepo.findAll();
        return modelMapper.map(violationTypeList,new TypeToken<List<ViolationTypeDTO>>(){}.getType());
    }

    public Respons<Integer> updateViolationType(int id, ViolationTypeDTO violationTypeDTO) {
        ViolationType violationType = violationTypeRepo.findById(id);
        if(violationType == null){
            return new Respons<>(false,"invalid id",null);
        }

        violationType.setViolationDescription(violationTypeDTO.getViolationDescription());
        violationType.setSlLawReference(violationTypeDTO.getSlLawReference());
        violationType.setAmount(violationTypeDTO.getAmount());
        violationType.setPoints(violationTypeDTO.getPoints());

        if (violationTypeDTO.getSeverityLevel() != null) {
            violationType.setSeverityLevel(ViolationType.SeverityLevel.valueOf(violationTypeDTO.getSeverityLevel().toUpperCase()));
        }

        ViolationType savedviolationType = violationTypeRepo.save(violationType);

        return new Respons<>(true,"update violation type",savedviolationType.getId());

    }

    public Respons<Integer> deleteViolationType(int id){
        ViolationType violationType = violationTypeRepo.findById(id);
        if(violationType == null ){
            return new Respons<>(false,"invalid id",null);
        }
        violationTypeRepo.deleteById(id);
        return new Respons<>(true,"delete violation type",id);
    }
}


