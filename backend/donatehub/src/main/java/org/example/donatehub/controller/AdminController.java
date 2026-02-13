package org.example.donatehub.controller;


import org.example.donatehub.enums.Role;
import org.example.donatehub.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    
 @Autowired
    private AdminService adminService;

    //approve pending users->org and admin
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            adminService.approveUser(id);
            return ResponseEntity.ok("User with ID " + id + " has been approved successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    //change the roll -> admin only
    @PutMapping("/changeroll/{id}")
    public ResponseEntity<?> changeRoll(@PathVariable Long id , @RequestParam Role role) {
        try{
            adminService.changeRoll(id , role);
            return ResponseEntity.ok("User has been changed successfully!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    //delete user
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try{
            adminService.deleteUser(id);
            return ResponseEntity.ok("User has been deleted successfully!");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //change user details

}
