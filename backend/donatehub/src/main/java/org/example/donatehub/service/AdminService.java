package org.example.donatehub.service;

import jakarta.transaction.Transactional;
import org.example.donatehub.entity.OrganizationProfile;
import org.example.donatehub.repo.OrganizationProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private OrganizationProfileRepository organizationProfileRepository;

    //approve org
    @Transactional
    public void setApprovalStatus(Long userId) {
        OrganizationProfile profile = organizationProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Organization profile not found for user: " + userId));

        profile.setApproved(true);
    }
}
