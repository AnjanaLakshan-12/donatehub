package org.example.donatehub.repo;


import org.example.donatehub.entity.DonationRequest;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest,Long> {
    List<DonationRequest> findAllByStatus(RequestStatus status);
    Page<DonationRequest> findAllByStatus(RequestStatus status, Pageable pageable);

    List<DonationRequest> findAllByOrganizationAndStatus(User organization, RequestStatus requestStatus);
    Page<DonationRequest> findAllByOrganizationAndStatus(User organization, RequestStatus requestStatus, Pageable pageable);

    Page<DonationRequest> findAll(Pageable pageable);

    List<DonationRequest> findByDonationId(Long id);
}
