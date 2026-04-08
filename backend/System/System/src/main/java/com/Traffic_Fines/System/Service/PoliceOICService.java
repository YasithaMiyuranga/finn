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
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public Respons<Integer> savePoliceOIC(PoliceOICDTO policeOICDTO) {
        try {
            // 1. Create User first
            User user = new User();
            user.setEmail(policeOICDTO.getEmail());
            // Hash the password for security
            user.setPassword(passwordEncoder.encode(policeOICDTO.getPassword())); 
            user.setUserType(User.UserType.POLICEOIC); // Set user type using Enum
            User savedUser = userRepo.save(user);

            // 2. Create PoliceOIC
            PoliceOIC oic = new PoliceOIC();
            oic.setPoliceid(policeOICDTO.getPoliceid());
            oic.setFullName(policeOICDTO.getFullName());
            oic.setPhone(policeOICDTO.getPhone());
            oic.setOfficerRank(policeOICDTO.getOfficerRank());
            oic.setProvince(policeOICDTO.getProvince());
            oic.setDistrict(policeOICDTO.getDistrict());
            oic.setCity(policeOICDTO.getCity());
            oic.setRegisteredDate(java.time.LocalDate.now());
            oic.setUser(savedUser);

            PoliceOIC savedOic = policeOICRepo.save(oic);
            return new Respons<Integer>(true, "Police OIC Registered Successfully", savedOic.getId());
        } catch (Exception e) {
            return new Respons<Integer>(false, "Error: " + e.getMessage(), null);
        }
    }

    public List<PoliceOICDTO> getAllPoliceOICs() {
        List<PoliceOIC> oicList = policeOICRepo.findAll();
        return oicList.stream().map(oic -> {
            PoliceOICDTO dto = modelMapper.map(oic, PoliceOICDTO.class);
            if (oic.getUser() != null) {
                dto.setEmail(oic.getUser().getEmail());
            }
            return dto;
        }).toList();
    }

    public Respons<Integer> deletePoliceOIC(int id) {
        if (policeOICRepo.existsById(id)) {
            policeOICRepo.deleteById(id);
            return new Respons<Integer>(true, "OIC Deleted Successfully", id);
        }
        return new Respons<Integer>(false, "OIC not found", null);
    }

    public Respons<Integer> updatePoliceOIC(int id, PoliceOICDTO policeOICDTO) {
        try {
            PoliceOIC oic = policeOICRepo.findById(id).orElse(null);
            if (oic == null) {
                return new Respons<Integer>(false, "OIC not found", null);
            }

            // Update OIC fields
            oic.setFullName(policeOICDTO.getFullName());
            oic.setPhone(policeOICDTO.getPhone());
            oic.setOfficerRank(policeOICDTO.getOfficerRank());
            oic.setProvince(policeOICDTO.getProvince());
            oic.setDistrict(policeOICDTO.getDistrict());
            oic.setCity(policeOICDTO.getCity());

            // Update associated User table (Email)
            if (oic.getUser() != null) {
                User user = oic.getUser();
                user.setEmail(policeOICDTO.getEmail());
                // If password is provided in DTO, update it as well
                if (policeOICDTO.getPassword() != null && !policeOICDTO.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(policeOICDTO.getPassword()));
                }
                userRepo.save(user);
            }

            policeOICRepo.save(oic);
            return new Respons<Integer>(true, "Police OIC Updated Successfully", oic.getId());
        } catch (Exception e) {
            return new Respons<Integer>(false, "Error: " + e.getMessage(), null);
        }
    }
}
