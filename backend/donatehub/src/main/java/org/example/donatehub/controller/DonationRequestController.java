package org.example.donatehub.controller;

import org.example.donatehub.entity.DonationRequest;
import org.example.donatehub.entity.User;
import org.example.donatehub.service.DonationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1")
public class DonationRequestController {

    @Autowired
    private DonationRequestService donationRequestService;

    //make a request
    @PostMapping("/api/v1/donationrequest")
    public ResponseEntity<DonationRequest> submitRequest(
            @PathVariable Long donationId,
            @RequestParam String purpose,
            @AuthenticationPrincipal User organization) {

        DonationRequest savedRequest = donationRequestService.createRequest(donationId, organization, purpose);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
    }

    //update request status
    //gel all request
    //get request by id
    //get request by user id

}
