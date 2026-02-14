package org.example.donatehub.service;

import java.util.List;
import java.util.Optional;

import org.example.donatehub.entity.OrganizationProfile;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.Role;
import org.example.donatehub.repo.OrganizationProfileRepository;
import org.example.donatehub.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class AdminService {
 @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrganizationProfileRepository organizationProfileRepository;



    //approve user - org and admin
    public ResponseEntity<?> approveUser(Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            User existionUser = user.get();
            existionUser.setEnable(true);

            userRepository.save(existionUser);
            return ResponseEntity.status(HttpStatus.CREATED).body("user has been approved");
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }



    //change user rolls
    public ResponseEntity<?> changeRoll(Long id , Role roll) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existionUser = user.get();
            existionUser.setRole(roll);
            userRepository.save(existionUser);
            return ResponseEntity.status(HttpStatus.CREATED).body("User has been changed successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    //delete user
    @Transactional
    public ResponseEntity<?> deleteUser(Long id) {
        Optional<User> userOpt = userRepository.findById(id);

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        // Delete organization profile
        try {
            List<OrganizationProfile> orgs = organizationProfileRepository.findByUserId(id);
            if (orgs != null && !orgs.isEmpty()) {
                organizationProfileRepository.deleteAll(orgs);
            }
        } catch (Exception e) {
            System.err.println("Error deleting org profile: " + e.getMessage());
        }

        // Delete the user
        userRepository.delete(user);
        return ResponseEntity.ok("User has been deleted successfully!");
    }


}
