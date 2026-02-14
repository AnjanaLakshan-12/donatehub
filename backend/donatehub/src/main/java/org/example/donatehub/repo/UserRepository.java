package org.example.donatehub.repo;


import org.example.donatehub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findByEmail(String email);
    List<User> findByDistrict(String district);
    Page<User> findAll(Pageable pageable);
}
