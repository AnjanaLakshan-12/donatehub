package org.example.donatehub.service;


import java.util.List;

import org.example.donatehub.entity.Donation;
import org.example.donatehub.entity.DonationRequest;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.RequestStatus;
import org.example.donatehub.repo.DonationRepository;
import org.example.donatehub.repo.DonationRequestRepository;
import org.example.donatehub.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;


@Service
public class DonationRequestService {
;
    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private DonationRequestRepository donationRequestRepository;
    @Autowired
    private UserRepository userRepository;

    //making a request to a donation
    @Transactional
    public DonationRequest createRequest(Long donationId, User organization , String purpose, int requestedQuantity) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation listing not found"));

        // Validate requested quantity
        if (requestedQuantity <= 0) {
            throw new RuntimeException("Requested quantity must be greater than 0");
        }
        if (requestedQuantity > donation.getQuantity()) {
            throw new RuntimeException("Requested quantity (" + requestedQuantity + ") exceeds available quantity (" + donation.getQuantity() + ")");
        }

        DonationRequest request = new DonationRequest();
        request.setDonation(donation);
        request.setOrganization(organization);  // Use the authenticated user passed in
        request.setPurpose(purpose);
        request.setRequestedQuantity(requestedQuantity);
        request.setStatus(RequestStatus.PENDING);

        return donationRequestRepository.save(request);
    }

    //approve reject request
    @Transactional
    public DonationRequest handleRequestStatus(Long requestId,RequestStatus status) {
        DonationRequest request = donationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // If approving the request, update the donation quantity
        if (status == RequestStatus.APPROVED && request.getStatus() != RequestStatus.APPROVED) {
            Donation donation = request.getDonation();
            int requestedQuantity = request.getRequestedQuantity();
            int currentQuantity = donation.getQuantity();

            // Validate there's enough quantity
            if (requestedQuantity > currentQuantity) {
                throw new RuntimeException("Cannot approve: Requested quantity (" + requestedQuantity + ") exceeds available quantity (" + currentQuantity + ")");
            }

            // Reduce the donation quantity
            int newQuantity = currentQuantity - requestedQuantity;
            donation.setQuantity(newQuantity);

            // Update donation status based on remaining quantity
            if (newQuantity == 0) {
                donation.setStatus(org.example.donatehub.enums.DonationStatus.DONATED);
            } else if (newQuantity < currentQuantity) {
                donation.setStatus(org.example.donatehub.enums.DonationStatus.RESERVED);
            }

            donationRepository.save(donation);
        }

        request.setStatus(status);
        return donationRequestRepository.save(request);
    }


    //get all request
    public List<DonationRequest> getAllRequest() {
        return donationRequestRepository.findAll();
    }
    
    //get all request with pagination
    public Page<DonationRequest> getAllRequestPaginated(Pageable pageable) {
        List<DonationRequest> allRequests = donationRequestRepository.findAll();
        return convertListToPage(allRequests, pageable);
    }

    //get all by status
    public List<DonationRequest> getAllApprovedRequest(RequestStatus requestStatus) {
        return donationRequestRepository.findAllByStatus(requestStatus);
    }
    
    //get all by status with pagination
    public Page<DonationRequest> getAllApprovedRequestPaginated(RequestStatus requestStatus, Pageable pageable) {
        List<DonationRequest> requests = donationRequestRepository.findAllByStatus(requestStatus);
        return convertListToPage(requests, pageable);
    }


    //get request by user id+satatus
    public List<DonationRequest> getallByUserAndSatus(User organization, RequestStatus requestStatus) {
        return donationRequestRepository.findAllByOrganizationAndStatus(organization,requestStatus);
    }
    
    //get request by user id+status with pagination
    public Page<DonationRequest> getallByUserAndStatusPaginated(User organization, RequestStatus requestStatus, Pageable pageable) {
        List<DonationRequest> requests = donationRequestRepository.findAllByOrganizationAndStatus(organization, requestStatus);
        return convertListToPage(requests, pageable);
    }
    
    //helper method to convert List to Page
    private Page<DonationRequest> convertListToPage(List<DonationRequest> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), list.size());
        
        List<DonationRequest> pageContent = list.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, list.size());
    }

    //get request by donation id
    public List<DonationRequest> getRequestsByDonationId(Long donationId) {
        return donationRequestRepository.findAll().stream()
                .filter(request -> request.getDonation().getId().equals(donationId))
                .toList();
    }
    
    //get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }


}