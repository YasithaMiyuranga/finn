package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepo extends JpaRepository<User,Integer> {
    User findByEmail(String email);
    User findById(int id);

    boolean existsByEmail(String email);





}
