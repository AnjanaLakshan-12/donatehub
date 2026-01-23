package org.example.donatehub.controller;

import org.example.donatehub.DTO.userDto;
import org.example.donatehub.entity.User;
import org.example.donatehub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    //create a new account
    @PostMapping("/add")
    public ResponseEntity<?> registerUser(@RequestBody userDto user ,
                                          @RequestParam(required = false) String orgName ,
                                          @RequestParam(required = false) String orgType,
                                          @RequestParam(required = false) String regNumber) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user,orgName,orgType,regNumber));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //get users by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //get all
    @GetMapping("/getall")
    public ResponseEntity<?> getAllUsers() {
        try{
            return ResponseEntity.ok(userService.getAllUsers());
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
        }
    }


    //update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //get users by district
    @GetMapping("/{district}")
    public ResponseEntity<?> getUserByDistrict(@PathVariable String district) {
        try{
            return ResponseEntity.ok(userService.getUserByDistrict(district));
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }


}
