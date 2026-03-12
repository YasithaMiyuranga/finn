package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.DriverDTO;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.User;
import com.Traffic_Fines.System.Repository.DriverRepo;

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
public class DriverService {
    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepo userRepo;

    public Respons saveDriver(DriverDTO driverDTO) {
        // check FK in police officer table
        Driver driver = driverRepo.findByUser(driverDTO.getUser()); // customise findByUser function
        if (driver != null) {
            return new Respons<>(false, "already has data", null);
        }
        // get user, using user id ( police_officerDTO user(int) )
        User user = userRepo.findById(driverDTO.getUser());
        if(user ==null) return new Respons<>(false, "invalid id", null);

        // save police office
        Driver drivers = new Driver();

        drivers.setFirstName(driverDTO.getFirstName());
        drivers.setLastName(driverDTO.getLastName());
        drivers.setLicenseNumber(driverDTO.getLicenseNumber());
        drivers.setDateOfBirth(driverDTO.getDateOfBirth());
        drivers.setPhone(driverDTO.getPhone());
        drivers.setAddress(driverDTO.getAddress());
        drivers.setDistrict(driverDTO.getDistrict());
        drivers.setCity(driverDTO.getCity());
        drivers.setLicenseissue(driverDTO.getLicenseissue());
        drivers.setLicenseExpiry(driverDTO.getLicenseExpiry());
        drivers.setUser(user); //  update karana vidiyta methana save karanna ba  update kiyanne ekak save kiyanne thava ekak 2k 1k nemi

        Driver savedDriver = driverRepo.save(drivers);

        return new Respons<>(true, "Police police OIC add", savedDriver.getId());
    }

    public List<Driver> getAllDrivers(){
        List<Driver>DriverList=driverRepo.findAll();
        return modelMapper.map(DriverList,new TypeToken<List<DriverDTO>>(){}.getType());
    }

    public Respons updateDriver(int id, DriverDTO driverDTO) {
        Driver driver = driverRepo.findById(id);
        if(driver == null ){
            return new Respons<>(false,"invalid id",null);
        }

        driver.setFirstName(driverDTO.getFirstName());
        driver.setLastName(driverDTO.getLastName());
        driver.setLicenseNumber(driverDTO.getLicenseNumber());
        driver.setDateOfBirth(driverDTO.getDateOfBirth());
        driver.setPhone(driverDTO.getPhone());
        driver.setAddress(driverDTO.getAddress());
        driver.setDistrict(driverDTO.getDistrict());
        driver.setCity(driverDTO.getCity());
        driver.setLicenseissue(driverDTO.getLicenseissue());
        driver.setLicenseExpiry(driverDTO.getLicenseExpiry());
        Driver savedDriver = driverRepo.save(driver);

        return new Respons<>(true,"update Driver ",savedDriver .getId());

    }

    public Respons deleteDriver (int id){
        Driver driver = driverRepo.findById(id);
        if(driver == null ){
            return new Respons(false,"invalid id",null);
        }
        driverRepo.deleteById(id);
        return new Respons(true,"delete Driver",id);
    }
}
