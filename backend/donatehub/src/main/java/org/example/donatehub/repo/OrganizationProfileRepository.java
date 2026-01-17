package org.example.donatehub.repo;


import org.example.donatehub.entity.OrganizationProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationProfileRepository extends JpaRepository<OrganizationProfile,Long> {
}
