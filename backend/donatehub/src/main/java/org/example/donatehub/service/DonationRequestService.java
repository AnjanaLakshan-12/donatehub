package org.example.donatehub.service;

import jakarta.transaction.Transactional;
import org.example.donatehub.entity.Donation;
import org.example.donatehub.entity.DonationRequest;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.RequestStatus;
import org.example.donatehub.repo.DonationRepository;
import org.example.donatehub.repo.DonationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonationRequestService {

    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private DonationRequestRepository donationRequestRepository;

    //making a request to a donation
    @Transactional
    public DonationRequest createRequest(Long donationId, User organization , String purpose) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation listing not found"));


        DonationRequest request = new DonationRequest();
        request.setDonation(donation);       // Points to the "What"
        request.setOrganization(organization);
        request.setPurpose(purpose);
        request.setStatus(RequestStatus.PENDING);

        return donationRequestRepository.save(request);
    }
}
