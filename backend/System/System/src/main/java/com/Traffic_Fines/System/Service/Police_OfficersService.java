package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.Police_OfficersDTO;
import com.Traffic_Fines.System.Entity.Police_Officers;
import com.Traffic_Fines.System.Entity.User;
import com.Traffic_Fines.System.Repository.Police_OfficersRepo;
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
public class Police_OfficersService {
    @Autowired
    private Police_OfficersRepo policeOfficersRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepo userRepo;

    public Respons savePoliceOfficer(Police_OfficersDTO police_officersDTO) {
        // check FK in police officer table
        Police_Officers police_officers = policeOfficersRepo.findByUser(police_officersDTO.getUserId()); // customise findByUser function
        if (police_officers != null) {
            return new Respons<>(false, "already has data", null);
        }
        // get user, using user id ( police_officerDTO user(int) )
        User user = userRepo.findById(police_officersDTO.getUserId()).orElse(null);
        if(user ==null) return new Respons<>(false, "invalid id", null);

        // save police office
        Police_Officers policeOfficers = new Police_Officers();

        policeOfficers.setFullName(police_officersDTO.getFullName());
        policeOfficers.setPoliceid(police_officersDTO.getPoliceid());
        policeOfficers.setDateOfBirth(police_officersDTO.getDateOfBirth());
        policeOfficers.setPhone(police_officersDTO.getPhone());
        policeOfficers.setAddress(police_officersDTO.getAddress());
        policeOfficers.setDistrict(police_officersDTO.getDistrict());
        policeOfficers.setPoliceStation(police_officersDTO.getPoliceStation());
        policeOfficers.setCourt(police_officersDTO.getCourt());
        if(police_officersDTO.getRegisteredDate() != null) {
            policeOfficers.setRegisteredDate(police_officersDTO.getRegisteredDate());
        } else {
            policeOfficers.setRegisteredDate(java.time.LocalDate.now());
        }

        policeOfficers.setUser(user);
        Police_Officers savedPoliceOfficer = policeOfficersRepo.save(policeOfficers);

        return new Respons<>(true, "Police Officer add", savedPoliceOfficer.getId());
    }


    public List<Police_Officers> getAllPolice_Officers(){
        List<Police_Officers>Police_OfficersList=policeOfficersRepo.findAll();
        return modelMapper.map(Police_OfficersList,new TypeToken<List<Police_OfficersDTO>>(){}.getType());
    }

    public Respons updatePolice_Officers(int id, Police_OfficersDTO police_officersDTO) {
        Police_Officers police_officers = policeOfficersRepo.findById(id);
        if(police_officers == null ){
            return new Respons<>(false,"invalid id",null);
        }

        police_officers.setFullName(police_officersDTO.getFullName());
        police_officers.setPoliceid(police_officersDTO.getPoliceid());
        police_officers.setDateOfBirth(police_officersDTO.getDateOfBirth());
        police_officers.setPhone(police_officersDTO.getPhone());
        police_officers.setAddress(police_officersDTO.getAddress());
        police_officers.setDistrict(police_officersDTO.getDistrict());
        police_officers.setPoliceStation(police_officersDTO.getPoliceStation());
        police_officers.setCourt(police_officersDTO.getCourt());
        if(police_officersDTO.getRegisteredDate() != null) {
            police_officers.setRegisteredDate(police_officersDTO.getRegisteredDate());
        }

        Police_Officers savedPoliceOfficer = policeOfficersRepo.save(police_officers);

        return new Respons<>(true,"update Police_Officers ",savedPoliceOfficer .getId());

    }

    public Respons deletePolice_Officers(int id){
        Police_Officers police_officers = policeOfficersRepo.findById(id);
        if(police_officers == null ){
            return new Respons<>(false,"invalid id",null);
        }
        policeOfficersRepo.deleteById(id);
        return new Respons<>(true,"delete police_officers",id);
    }
}


