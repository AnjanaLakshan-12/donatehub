package org.example.donatehub.service;

import java.util.List;
import java.util.Optional;

import org.example.donatehub.DTO.UserDto;
import org.example.donatehub.entity.OrganizationProfile;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.Role;
import org.example.donatehub.repo.OrganizationProfileRepository;
import org.example.donatehub.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrganizationProfileRepository organizationProfileRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    //create user
    @Transactional //if something goes wrong in orgprofile user also will not be saves all or nothing
    public User createUser(UserDto user,
                           String orgName,
                           String orgType,
                           String regNumber) {
        List<User> exists = userRepository.findByEmail(user.getEmail());
        if (!exists.isEmpty()) {
            throw new RuntimeException("Email already exists!");
        }


        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setDistrict(user.getDistrict());
        newUser.setRole(user.getRole());


        if (newUser.getRole() == Role.DONOR ||  newUser.getRole() == Role.ADMIN) {
            newUser.setEnable(true);
        } else {
            newUser.setEnable(false); // Needs Admin Approval
        }


        User saveduser = userRepository.save(newUser);

        if (saveduser.getRole() == Role.ORG) {
            OrganizationProfile profile = new OrganizationProfile();
            profile.setUser(saveduser);
            profile.setOrganizationName(orgName);
            profile.setOrganizationType(orgType);
            profile.setRegistrationNumber(regNumber);
            profile.setApproved(false);

            organizationProfileRepository.save(profile);
        }

        return saveduser;
    }


    //get user by id
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    //get all
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //get all with pagination
    public Page<User> getAllUsersPaginated(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    //update
    public User updateUser(Long id, UserDto user) {
        User requiredUser = userRepository.findById(id).
                orElseThrow(() -> new RuntimeException("User not found!"));

        requiredUser.setEmail(user.getEmail());
        requiredUser.setFirstName(user.getFirstName());
        requiredUser.setLastName(user.getLastName());
        requiredUser.setDistrict(user.getDistrict());

        userRepository.save(requiredUser);
        return requiredUser;
    }

    //get users by district
    public ResponseEntity<?> getUserByDistrict(String district) {
        List<User> userList = userRepository.findByDistrict(district);
        if (userList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(userList);
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).get(0);
    }


}




