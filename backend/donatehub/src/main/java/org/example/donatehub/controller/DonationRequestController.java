package org.example.donatehub.controller;


import java.util.List;

import org.example.donatehub.entity.DonationRequest;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.RequestStatus;
import org.example.donatehub.service.DonationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/donationrequest")
public class DonationRequestController {

    @Autowired
    private DonationRequestService donationRequestService;

    //make a request
    @PostMapping("/submit/{donationId}")
    public ResponseEntity<?> submitRequest(
            @PathVariable Long donationId,
            @RequestParam String purpose,
            @RequestParam int requestedQuantity,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {

        try {
            // Get the email from the authenticated user
            String email = userDetails.getUsername();
            User organization = donationRequestService.getUserByEmail(email);
            
            DonationRequest savedRequest = donationRequestService.createRequest(donationId, organization, purpose, requestedQuantity);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    //approve,reject request -done by the  donor
    @PutMapping("/{requestId}/action")
    public ResponseEntity<?> handleRequestStatus(
            @PathVariable Long requestId,
            @RequestParam String status) {
        try {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            DonationRequest updatedRequest = donationRequestService.handleRequestStatus(requestId, requestStatus);
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Action failed: "+ e.getMessage());
        }
    }


//    //get all by status
//    @GetMapping("/status/{status}")
//    public ResponseEntity<?> getAllApprovedRequest(@PathVariable String status) {
//        try {
//            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
//            List<DonationRequest> requests = donationRequestService.getAllApprovedRequest(requestStatus);
//
//            if (requests.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("there are no"+ status + "requests");
//            }
//            return ResponseEntity.ok().body(requests);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//        }
//    }

    
    //get all by status with pagination
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<?> getAllApprovedRequestPaginated(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        try {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<DonationRequest> requests = donationRequestService.getAllApprovedRequestPaginated(requestStatus, pageable);
            return ResponseEntity.ok().body(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage()+"there is no donation");
        }
    }


//    //gel all request
//    @GetMapping("/getall")
//    public ResponseEntity<?> getAllRequest() {
//        try{
//            List<DonationRequest> allRequests =  donationRequestService.getAllRequest();
//            if (allRequests.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("there are no requests");
//            }else{
//                return ResponseEntity.ok().body(allRequests);
//            }
//
//        }catch (Exception e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
    
    //get all request with pagination
    @GetMapping("/getall/paginated")
    public ResponseEntity<?> getAllRequestPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<DonationRequest> allRequests = donationRequestService.getAllRequestPaginated(pageable);
            return ResponseEntity.ok().body(allRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    //get request by donation id
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<?> getRequestsByDonationId(@PathVariable Long donationId) {
        try {
            List<DonationRequest> requests = donationRequestService.getRequestsByDonationId(donationId);
            
            if (requests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No requests found for this donation");
            }
            return ResponseEntity.ok().body(requests);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get request by user id+satatus
    @GetMapping("/user/{status}")
    public ResponseEntity<?> getallByUserAndSatus(
            @PathVariable String status, 
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            // Get the email from the authenticated user
            String email = userDetails.getUsername();
            User organization = donationRequestService.getUserByEmail(email);

            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            List<DonationRequest> requests = donationRequestService.getallByUserAndSatus(organization, requestStatus);

            if (requests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok().body(requests);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}