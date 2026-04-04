package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.DriverDTO;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.User;
import com.Traffic_Fines.System.Repository.DriverRepo;
import com.Traffic_Fines.System.Repository.UserRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        drivers.setGender(Driver.Gender.valueOf(driverDTO.getGender()));
        drivers.setLicenseNumber(driverDTO.getLicenseNumber());
        drivers.setDateOfBirth(driverDTO.getDateOfBirth());
        drivers.setPhone(driverDTO.getPhone());
        drivers.setAddress(driverDTO.getAddress());
        drivers.setProvince(Driver.Province.valueOf(driverDTO.getProvince()));
        drivers.setDistrict(driverDTO.getDistrict());
        drivers.setCity(driverDTO.getCity());
        drivers.setLicenseissue(driverDTO.getLicenseissue());
        drivers.setLicenseExpiry(driverDTO.getLicenseExpiry());
        drivers.setClassOfVehicle(driverDTO.getClassOfVehicle());
        drivers.setUser(user);

        Driver savedDriver = driverRepo.save(drivers);

        return new Respons<>(true, "Police police OIC add", savedDriver.getId());
    }

    public List<java.util.Map<String, Object>> getAllDrivers() {
        List<Driver> driverList = driverRepo.findAll();
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (Driver d : driverList) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", d.getId());
            map.put("firstName", d.getFirstName());
            map.put("lastName", d.getLastName());
            map.put("licenseNumber", d.getLicenseNumber());
            map.put("licenseissue", d.getLicenseissue() != null ? d.getLicenseissue().toString() : null);
            map.put("licenseExpiry", d.getLicenseExpiry() != null ? d.getLicenseExpiry().toString() : null);
            map.put("phone", d.getPhone());
            map.put("address", d.getAddress());
            map.put("gender", d.getGender() != null ? d.getGender().toString() : null);
            map.put("province", d.getProvince() != null ? d.getProvince().toString() : null);
            map.put("district", d.getDistrict());
            map.put("city", d.getCity());
            map.put("classOfVehicle", d.getClassOfVehicle());
            map.put("dateOfBirth", d.getDateOfBirth() != null ? d.getDateOfBirth().toString() : null);
            map.put("registeredDate", d.getRegisteredDate() != null ? d.getRegisteredDate().toString() : null);
            // Include email from linked User
            if (d.getUser() != null) {
                map.put("email", d.getUser().getEmail());
            } else {
                map.put("email", null);
            }
            result.add(map);
        }
        return result;
    }

    public Respons updateDriver(int id, DriverDTO driverDTO) {
        Driver driver = driverRepo.findById(id);
        if(driver == null ){
            return new Respons<>(false,"invalid id",null);
        }

        driver.setFirstName(driverDTO.getFirstName());
        driver.setLastName(driverDTO.getLastName());
        driver.setGender(Driver.Gender.valueOf(driverDTO.getGender()));
        driver.setLicenseNumber(driverDTO.getLicenseNumber());
        driver.setDateOfBirth(driverDTO.getDateOfBirth());
        driver.setPhone(driverDTO.getPhone());
        driver.setAddress(driverDTO.getAddress());
        driver.setProvince(Driver.Province.valueOf(driverDTO.getProvince()));
        driver.setDistrict(driverDTO.getDistrict());
        driver.setCity(driverDTO.getCity());
        driver.setLicenseissue(driverDTO.getLicenseissue());
        driver.setLicenseExpiry(driverDTO.getLicenseExpiry());
        driver.setClassOfVehicle(driverDTO.getClassOfVehicle());
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

    public Driver getDriverByUserId(int userId) {
        return driverRepo.findByUser(userId);
    }

    public java.util.Map<String, Object> getDriverByLicense(int licenseNumber) {
        Driver d = driverRepo.findByLicenseNumber(licenseNumber);
        if (d == null) return null;
        
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", d.getId());
        map.put("firstName", d.getFirstName());
        map.put("lastName", d.getLastName());
        map.put("licenseNumber", d.getLicenseNumber());
        map.put("address", d.getAddress());
        map.put("classOfVehicle", d.getClassOfVehicle());
        return map;
    }

    // =================== STATS FOR ADMIN DASHBOARD ===================

    public Map<String, Long> getDriverStats() {
        LocalDate today = LocalDate.now();

        long total = driverRepo.countBy();
        long last7Days = driverRepo.countByRegisteredDateAfter(today.minusDays(7));

        // Last calendar month
        LocalDate lastMonth = today.minusMonths(1);
        long lastMonthCount = driverRepo.countByLastMonth(lastMonth.getMonthValue(), lastMonth.getYear());

        // Last year
        long lastYearCount = driverRepo.countByYear(today.getYear() - 1);

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalDrivers", total);
        stats.put("last7Days", last7Days);
        stats.put("lastMonth", lastMonthCount);
        stats.put("lastYear", lastYearCount);
        return stats;
    }

    public List<Map<String, Object>> getMonthlyChartData() {
        int currentYear = LocalDate.now().getYear();
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", Month.of(m).name().charAt(0) + Month.of(m).name().substring(1).toLowerCase());
            entry.put("count", driverRepo.countByMonthAndYear(m, currentYear));
            chartData.add(entry);
        }
        return chartData;
    }
}
