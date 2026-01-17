package org.example.donatehub.controller;

import org.example.donatehub.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class DonationController {

    @Autowired
    private DonationService donationService;

    //create a new listing  /api/donations

    //get all donations
    //get all available  /api/donations
    //delete /api/donations/{id}
    //update
    //get all by category
    //get all by user

}
