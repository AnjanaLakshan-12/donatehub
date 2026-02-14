package org.example.donatehub.controller;

import org.example.donatehub.DTO.UserDto;
import org.example.donatehub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    //create a new account
    @PostMapping("/add")
    public ResponseEntity<?> registerUser(@RequestBody UserDto user ,
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
    @GetMapping("/get/{id}")
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

    //get all with pagination
    @GetMapping("/getall/paginated")
    public ResponseEntity<?> getAllUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try{
            Pageable pageable = PageRequest.of(page, size);
            Page<org.example.donatehub.entity.User> users = userService.getAllUsersPaginated(pageable);
            return ResponseEntity.ok(users);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(e.getMessage());
        }
    }



    //update
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto user) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //get users by district
    @GetMapping("/get/district/{district}")
    public ResponseEntity<?> getUserByDistrict(@PathVariable String district) {
        try{
            return ResponseEntity.ok(userService.getUserByDistrict(district));
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }


    //change user details


}
