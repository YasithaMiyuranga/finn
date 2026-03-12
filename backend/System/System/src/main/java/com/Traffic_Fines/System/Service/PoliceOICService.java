package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.PoliceOICDTO;
import com.Traffic_Fines.System.Entity.PoliceOIC;
import com.Traffic_Fines.System.Entity.User;
import com.Traffic_Fines.System.Repository.PoliceOICRepo;

import com.Traffic_Fines.System.Repository.UserRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
public class PoliceOICService {
    @Autowired
    private PoliceOICRepo policeOICRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepo userRepo;

    public Respons savePoliceOlC(PoliceOICDTO policeOICDTO) {

        PoliceOIC policeOIC = policeOICRepo.findByUser(policeOICDTO.getUser()); // customise findByUser function
        if (policeOIC != null) {
            return new Respons<>(false, "already has data", null);
        }

        User user = userRepo.findById(policeOICDTO.getUser());
        if(user ==null) return new Respons<>(false, "invalid id", null);

        // save police office
        PoliceOIC policeOICs = new PoliceOIC();

        policeOICs.setFullName(policeOICDTO.getFullName());
        policeOICs.setPoliceid(policeOICDTO.getPoliceid());
        policeOICs.setDateOfBirth(policeOICDTO.getDateOfBirth());
        policeOICs.setPhone(policeOICDTO.getPhone());
        policeOICs.setAddress(policeOICDTO.getAddress());
        policeOICs.setDistrict(policeOICDTO.getDistrict());
        policeOICs.setPoliceStation(policeOICDTO.getPoliceStation());

        policeOICs.setUser(user); //  update karana vidiyta methana save karanna ba  update kiyanne ekak save kiyanne thava ekak 2k 1k nemi

        PoliceOIC savedPoliceOIC = policeOICRepo.save(policeOICs);

        return new Respons<>(true, "Police police OIC add", savedPoliceOIC.getId());
    }

    public List<PoliceOIC> getAllPoliceOICs(){
        List<PoliceOIC>PoliceOICList=policeOICRepo.findAll();
        return modelMapper.map(PoliceOICList,new TypeToken<List<PoliceOICDTO>>(){}.getType());
    }

    public Respons updatePoliceOIC(int id, PoliceOICDTO policeOICDTO) {
        PoliceOIC policeOIC = policeOICRepo.findById(id);
        if(policeOIC == null ){
            return new Respons<>(false,"invalid id",null);
        }

        policeOIC.setFullName(policeOICDTO.getFullName());
        policeOIC.setPoliceid(policeOICDTO.getPoliceid());
        policeOIC.setDateOfBirth(policeOICDTO.getDateOfBirth());
        policeOIC.setPhone(policeOICDTO.getPhone());
        policeOIC.setAddress(policeOICDTO.getAddress());
        policeOIC.setDistrict(policeOICDTO.getDistrict());
        policeOIC.setPoliceStation(policeOICDTO.getPoliceStation());

        PoliceOIC savedPoliceOIC = policeOICRepo.save(policeOIC);

        return new Respons<>(true,"update Police_Officers ",savedPoliceOIC .getId());

    }

    public Respons deletePoliceOIC (int id){
        PoliceOIC policeOIC = policeOICRepo.findById(id);
        if(policeOIC == null ){
            return new Respons(false,"invalid id",null);
        }
        policeOICRepo.deleteById(id);
        return new Respons(true,"delete police_officers",id);
    }
}
