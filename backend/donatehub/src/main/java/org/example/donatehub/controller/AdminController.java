package org.example.donatehub.controller;


import org.example.donatehub.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1/admin")
public class AdminController {

    // approve org
    @Autowired
    private AdminService adminService;

    // PATCH is used because we are only updating one field (approved)
    //@PatchMapping("/organizations/{orgId}/approve")
    @PutMapping("/organizations/{orgId}/approve")
    public ResponseEntity<String> approveOrg(@PathVariable Long orgId) {
        adminService.setApprovalStatus(orgId);
        return ResponseEntity.ok("Organization has been approved.");
    }

}
