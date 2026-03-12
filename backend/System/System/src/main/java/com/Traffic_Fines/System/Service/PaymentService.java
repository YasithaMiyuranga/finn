package com.Traffic_Fines.System.Service;


import com.Traffic_Fines.System.Dto.PaymentDTO;
import com.Traffic_Fines.System.Entity.Payment;
import com.Traffic_Fines.System.Entity.Driver;

import com.Traffic_Fines.System.Repository.PaymentRepo;
import com.Traffic_Fines.System.Repository.DriverRepo;



import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
public class PaymentService {
    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private DriverRepo driverRepo;


    public Respons savePayment(PaymentDTO paymentDTO) {

        Driver driver = driverRepo.findById(paymentDTO.getDriver());
        if (driver == null) return new Respons<>(false, "invalid id", null);

        Payment payment = new Payment();

        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentAmount(paymentDTO.getPaymentAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setTransactionId(payment.getTransactionId());

        payment.setDriver(driver); //  update karana vidiyta methana save karanna ba  update kiyanne ekak save kiyanne thava ekak 2k 1k nemi

        Payment savedPayment = paymentRepo.save(payment);

        return new Respons<>(true, "Payment add", savedPayment.getId());
    }

    public List<Payment> getAllPayment(){
        List<Payment>PaymentList=paymentRepo.findAll();
        return modelMapper.map(PaymentList,new TypeToken<List<Payment>>(){}.getType());
    }

    public Respons updatePayment(int id, PaymentDTO paymentDTO) {
        Payment payment = paymentRepo.findById(id);
        if(payment == null ){
            return new Respons<>(false,"invalid id",null);
        }

        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setPaymentAmount(paymentDTO.getPaymentAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setTransactionId(payment.getTransactionId());

        Payment savedPayment= paymentRepo.save(payment);

        return new Respons<>(true,"update payment ",savedPayment .getId());

    }

    public Respons deletePayment(int id){
        Payment payment = paymentRepo.findById(id);
        if(payment == null ){
            return new Respons(false,"invalid id",null);
        }
        paymentRepo.deleteById(id);
        return new Respons(true,"delete payment ",id);
    }

}