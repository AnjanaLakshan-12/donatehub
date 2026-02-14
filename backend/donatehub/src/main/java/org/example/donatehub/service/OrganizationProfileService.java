package org.example.donatehub.service;


import java.util.List;
import java.util.Optional;

import org.example.donatehub.entity.OrganizationProfile;
import org.example.donatehub.entity.User;
import org.example.donatehub.repo.OrganizationProfileRepository;
import org.example.donatehub.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class OrganizationProfileService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrganizationProfileRepository organizationProfileRepository;


    //Fetch the org profile linked to a specific user.
    public ResponseEntity<?> orgUserDetails(Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            User existingUser = user.get();
            List<OrganizationProfile> profiles = organizationProfileRepository.findByUser(existingUser);

            if (!profiles.isEmpty()) {
                return ResponseEntity.ok(profiles.get(0));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User exists but has no org");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

}