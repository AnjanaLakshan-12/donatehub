
package org.example.donatehub.controller;

import org.example.donatehub.entity.Donation;
import org.example.donatehub.enums.DonationStatus;
import org.example.donatehub.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    //create a new listing
    @PostMapping("/add")
    public ResponseEntity<?> addDonation(@RequestPart Donation donation,
                                         @RequestPart MultipartFile file,
                                         @AuthenticationPrincipal UserDetails userDetails) {

        try{
            String email = userDetails.getUsername();
            Donation donation1 = donationService.addDonation(donation, file, email);
            return new ResponseEntity<>(donation1 , HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }

    }


    //get all donations with pagination
    @GetMapping("/getall/paginated")
    public ResponseEntity<?> getAllDonationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Donation> donations = donationService.getAllDonationsPaginated(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(donations);
    }







    //change availabilitybyid
    @PutMapping("/{id}")
    public Donation changeAvalability(@PathVariable Long id, @RequestParam DonationStatus avalability) {
        return donationService.changeAvalability(id, avalability);
    }



    
    //get all available donations with pagination
    @GetMapping("/getall/available/paginated")
    public ResponseEntity<?> getAllAvailableDonationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Donation> donations = donationService.getAllAvailableDonationsPaginated(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(donations);
    }

    //delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletebyid(@PathVariable Long id) {
        return donationService.deletebyid(id);
    }


    
    //get all by category with pagination
    @GetMapping("/category/{category}/paginated")
    public ResponseEntity<?> getAllByCategoryPaginated(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Donation> donations = donationService.getAllByCategoryPaginated(category, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(donations);
    }


    
    //get all by user with pagination
    @GetMapping("/username/{username}/paginated")
    public ResponseEntity<?> getDonationByUserPaginated(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Donation> donations = donationService.getDonationByUserPaginated(username, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(donations);
    }
    

    //update
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDonation(@PathVariable Long id ,@RequestBody Donation donation) {
        try {
            Donation updatedDonation = donationService.updateDonation(id,donation);
            return ResponseEntity.ok(updatedDonation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDonationById(@PathVariable Long id) {
        try{
            Donation donation = donationService.getDonationById(id);
            return new ResponseEntity<>(donation , HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("/{donationId}/image")
    public ResponseEntity<byte[]> getImageByDonation(@PathVariable Long donationId) {
        Donation donation = donationService.getDonationById(donationId);
        byte[] imageFile = donation.getImageData();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(donation.getImagetype()))
                .body(imageFile);
    }

    //search option
    @GetMapping("/search")
    public List<Donation> search(@RequestParam String keyword) {
        return donationService.searchDonations(keyword);
    }

}
