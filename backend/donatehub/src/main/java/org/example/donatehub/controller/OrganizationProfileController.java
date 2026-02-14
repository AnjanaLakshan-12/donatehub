package org.example.donatehub.controller;


import org.example.donatehub.service.OrganizationProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/organizationProfile")
public class OrganizationProfileController {

    @Autowired
    private OrganizationProfileService organizationProfileService;

    // update /api/profiles/org


    //Fetch the org profile linked to a specific user. /api/profiles/org/{userId}
    @GetMapping("/user/organization/{id}")
    public ResponseEntity<?> orgUserDetails(Long id) {
        try{
            return organizationProfileService.orgUserDetails(id);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}