package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentRepo extends JpaRepository<Payment,Integer>{
    Payment findById(int id);

}