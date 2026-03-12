package com.Traffic_Fines.System.Service;


import com.Traffic_Fines.System.Dto.TrafficFineDTO;
import com.Traffic_Fines.System.Entity.TrafficFine;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.ViolationType;
import com.Traffic_Fines.System.Entity.Police_Officers;

import com.Traffic_Fines.System.Repository.TrafficFineRepo;
import com.Traffic_Fines.System.Repository.DriverRepo;

import com.Traffic_Fines.System.Repository.Police_OfficersRepo;
import com.Traffic_Fines.System.Repository.ViolationTypeRepo;

import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
public class TrafficFineService {
    @Autowired
    private TrafficFineRepo trafficFineRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private Police_OfficersRepo policeOfficersRepo;

    @Autowired
    private ViolationTypeRepo violationTypeRepo;

    public Respons saveTrafficFine(TrafficFineDTO trafficFineDTO) {

        Driver driver = driverRepo.findById(trafficFineDTO.getDriver());
        if (driver == null) return new Respons<>(false, "invalid id", null);

        Police_Officers police_officers = policeOfficersRepo.findById(trafficFineDTO.getPoliceOfficer());
        if (police_officers == null) return new Respons<>(false, "invalid id", null);

        ViolationType violationType = violationTypeRepo.findById(trafficFineDTO.getViolationType());
        if (violationType == null) return new Respons<>(false, "invalid id", null);

        TrafficFine trafficFines = new TrafficFine();

        trafficFines.setFineNumber(trafficFineDTO.getFineNumber());
        trafficFines.setIssueDate(trafficFineDTO.getIssueDate());
        trafficFines.setIssueTime(trafficFineDTO.getIssueTime());
        trafficFines.setLocation(trafficFineDTO.getLocation());
        trafficFines.setFineAmount(trafficFineDTO.getFineAmount());
        trafficFines.setOutstandingAmount(trafficFineDTO.getOutstandingAmount());
        trafficFines.setPaymentStatus(trafficFineDTO.getPaymentStatus());
        trafficFines.setPaymentDueDate(trafficFineDTO.getPaymentDueDate());

        trafficFines.setDriver(driver); //  update karana vidiyta methana save karanna ba  update kiyanne ekak save kiyanne thava ekak 2k 1k nemi
        trafficFines.setPoliceOfficer(police_officers);
        trafficFines.setViolationType(violationType);

        TrafficFine savedTrafficFine = trafficFineRepo.save(trafficFines);

        return new Respons<>(true, "Traffic Fines add", savedTrafficFine.getId());
    }

    public List<TrafficFine> getAllTrafficFines(){
        List<TrafficFine>TrafficFineList=trafficFineRepo.findAll();
        return modelMapper.map(TrafficFineList,new TypeToken<List<TrafficFine>>(){}.getType());
    }

    public Respons updateTrafficFine(int id, TrafficFineDTO trafficFineDTO) {
        TrafficFine trafficFine = trafficFineRepo.findById(id);
        if(trafficFine == null ){
            return new Respons<>(false,"invalid id",null);
        }

        trafficFine.setFineNumber(trafficFineDTO.getFineNumber());
        trafficFine.setIssueDate(trafficFineDTO.getIssueDate());
        trafficFine.setIssueTime(trafficFineDTO.getIssueTime());
        trafficFine.setLocation(trafficFineDTO.getLocation());
        trafficFine.setFineAmount(trafficFineDTO.getFineAmount());
        trafficFine.setOutstandingAmount(trafficFineDTO.getOutstandingAmount());
        trafficFine.setPaymentStatus(trafficFineDTO.getPaymentStatus());
        trafficFine.setPaymentDueDate(trafficFineDTO.getPaymentDueDate());

        TrafficFine savedTrafficFine= trafficFineRepo.save(trafficFine);

        return new Respons<>(true,"update Traffic Fine ",savedTrafficFine .getId());

    }

    public Respons deleteTrafficFine (int id){
        TrafficFine trafficFine = trafficFineRepo.findById(id);
        if(trafficFine == null ){
            return new Respons(false,"invalid id",null);
        }
        trafficFineRepo.deleteById(id);
        return new Respons(true,"delete Traffic Fine ",id);
    }

}