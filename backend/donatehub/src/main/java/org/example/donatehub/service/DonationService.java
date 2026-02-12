package org.example.donatehub.service;

import java.io.IOException;
import java.util.List;

import org.example.donatehub.entity.Donation;
import org.example.donatehub.entity.User;
import org.example.donatehub.enums.DonationStatus;
import org.example.donatehub.repo.DonationRepository;
import org.example.donatehub.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;
    
    @Autowired
    private UserRepository userRepository;

    //get all donations
    public List<Donation> getAllDonations(){
        return donationRepository.findAll();
    }
    
    //get all donations with pagination
    public Page<Donation> getAllDonationsPaginated(Pageable pageable){
        List<Donation> allDonations = donationRepository.findAll();
        return convertListToPage(allDonations, pageable);
    }

    //add a new donation
    public Donation addDonation(Donation donation, MultipartFile file, String email) throws IOException {
        // Fetch the user by email (username)
        List<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User donor = users.get(0);
        
        // Set the donor
        donation.setDonor(donor);
        
        // Set image data
        donation.setImageName(file.getOriginalFilename());
        donation.setImagetype(file.getContentType());
        donation.setImageData(file.getBytes());

        return donationRepository.save(donation);
    }

    //change availability by id
    public Donation changeAvalability(Long id, DonationStatus avalability) {
        Donation donationAvailability = donationRepository.findById(id).
                orElseThrow(()-> new RuntimeException("donation not found"));

        donationAvailability.setStatus(avalability);
        return donationRepository.save(donationAvailability);

    }

    //get all available donations  /api/donations
    public List<Donation> getAllAvailableDonations() {
        List<Donation> allDonations =  donationRepository.findAll();
        List<Donation> availableDonatios = allDonations.stream().filter(a->a.getStatus() == DonationStatus.AVAILABLE).toList();

        return availableDonatios;
    }
    
    //get all available donations with pagination
    public Page<Donation> getAllAvailableDonationsPaginated(Pageable pageable) {
        List<Donation> allDonations = donationRepository.findAll();
        List<Donation> availableDonatios = allDonations.stream().filter(a->a.getStatus() == DonationStatus.AVAILABLE).toList();
        return convertListToPage(availableDonatios, pageable);
    }

    //delete by id
    public ResponseEntity<?> deletebyid(Long id){
        donationRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("donation deleted successfully");
    }

    //get all by category
    public List<Donation> getAllByCategory(String category) {
      //  List<Donation> allDonations = donationRepository.findAll().stream().filter(a->a.getCategory().equals(category)).toList();
        return donationRepository.findByCategoryName(category);
    }
    
    //get all by category with pagination
    public Page<Donation> getAllByCategoryPaginated(String category, Pageable pageable) {
        List<Donation> categoryDonations = donationRepository.findByCategoryName(category);
        return convertListToPage(categoryDonations, pageable);
    }

    //update
    public Donation updateDonation(Long id , Donation donation) {
        Donation matchinDonation = donationRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("donation not found"));

        matchinDonation.setQuantity(donation.getQuantity());
        matchinDonation.setStatus(donation.getStatus());
        matchinDonation.setCategory(donation.getCategory());

        donationRepository.save(matchinDonation);

        return matchinDonation;
    }


    //get all by user
    public List<Donation> getDonationByUser(String username) {
        return donationRepository.findByDonorEmail(username);
    }
    
    //get all by user with pagination
    public Page<Donation> getDonationByUserPaginated(String username, Pageable pageable) {
        List<Donation> userDonations = donationRepository.findByDonorEmail(username);
        return convertListToPage(userDonations, pageable);
    }
    
    //helper method to convert List to Page
    private Page<Donation> convertListToPage(List<Donation> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), list.size());
        
        List<Donation> pageContent = list.subList(start, end);
        return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, list.size());
    }


    //get donation by id
    public Donation getDonationById(Long id) {
       return  donationRepository.findById(id).orElseThrow(()-> new RuntimeException("donation not found"));
    }
}
