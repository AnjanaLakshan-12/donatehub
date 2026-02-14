package org.example.donatehub.repo;


import org.example.donatehub.entity.OrganizationProfile;
import org.example.donatehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationProfileRepository extends JpaRepository<OrganizationProfile,Long> {

    List<OrganizationProfile> findByUserId(Long userId);

    List<OrganizationProfile> findByUser(User user);
}
