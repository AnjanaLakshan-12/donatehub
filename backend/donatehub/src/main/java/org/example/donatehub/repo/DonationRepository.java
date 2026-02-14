package org.example.donatehub.repo;


import org.example.donatehub.entity.Donation;
import org.example.donatehub.enums.DonationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation,Long> {
    List<Donation> findByCategoryName(String categoryName);
    Page<Donation> findByCategoryName(String categoryName, Pageable pageable);

    List<Donation> findByDonorEmail(String email);
    Page<Donation> findByDonorEmail(String email, Pageable pageable);

    Page<Donation> findByStatus(DonationStatus status, Pageable pageable);

    List<Donation> findByCategoryId(Long id);
}
