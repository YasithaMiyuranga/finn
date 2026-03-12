package com.Traffic_Fines.System.Service;


import com.Traffic_Fines.System.Dto.PendingFineDTO;
import com.Traffic_Fines.System.Entity.PendingFine;

import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.TrafficFine;

import com.Traffic_Fines.System.Repository.PendingFineRepo;
import com.Traffic_Fines.System.Repository.DriverRepo;


import com.Traffic_Fines.System.Repository.TrafficFineRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
public class PendingFineService {
    @Autowired
    private PendingFineRepo pendingFineRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private TrafficFineRepo trafficFineRepo;


    public Respons savePendingFine(PendingFineDTO pendingFineDTO) {

        Driver driver = driverRepo.findById(pendingFineDTO.getDriver());
        if (driver == null) return new Respons<>(false, "invalid id", null);

        TrafficFine trafficFine = trafficFineRepo.findById(pendingFineDTO.getFine());
        if (trafficFine == null) return new Respons<>(false, "invalid id", null);

        PendingFine pendingFine = new PendingFine();

        pendingFine.setLastReminderSent(pendingFineDTO.getLastReminderSent());
        pendingFine.setOicReviewStatus(pendingFineDTO.getOicReviewStatus());


        pendingFine.setDriver(driver); //  update karana vidiyta methana save karanna ba  update kiyanne ekak save kiyanne thava ekak 2k 1k nemi
        pendingFine.setFine(trafficFine);

        PendingFine savedPendingFine = pendingFineRepo.save(pendingFine);

        return new Respons<>(true, "Pending Fine add", savedPendingFine.getId());
    }

    public List<PendingFine> getAllPendingFine(){
        List<PendingFine>PendingFinetList=pendingFineRepo.findAll();
        return modelMapper.map(PendingFinetList,new TypeToken<List<PendingFine>>(){}.getType());
    }

    public Respons updatePendingFine(int id, PendingFineDTO pendingFineDTO) {
        PendingFine pendingFine = pendingFineRepo.findById(id);
        if(pendingFine == null ){
            return new Respons<>(false,"invalid id",null);
        }

        pendingFine.setLastReminderSent(pendingFineDTO.getLastReminderSent());
        pendingFine.setOicReviewStatus(pendingFineDTO.getOicReviewStatus());

        PendingFine savedPendingFine= pendingFineRepo.save(pendingFine);

        return new Respons<>(true,"update Pending Fine ",savedPendingFine .getId());

    }

    public Respons deletePendingFine(int id){
        PendingFine pendingFine = pendingFineRepo.findById(id);
        if(pendingFine == null ){
            return new Respons(false,"invalid id",null);
        }
        pendingFineRepo.deleteById(id);
        return new Respons(true,"delete Pending Fine ",id);
    }

}