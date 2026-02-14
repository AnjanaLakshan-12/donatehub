package org.example.donatehub.service;

import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;
import org.example.donatehub.entity.Category;
import org.example.donatehub.entity.Donation;
import org.example.donatehub.repo.CategoryRepository;
import org.example.donatehub.repo.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DonationRepository donationRepository;

     //add new category
    public ResponseEntity<?> addCategory(Category category){
        List<Category> allcategory = categoryRepository.findAll();
        boolean exists = allcategory.stream()
                .anyMatch(c -> c.getName().equalsIgnoreCase(category.getName())); 

        if (exists){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Category already exists");
        }else{
            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
        }

    }

    
    //get all categories
    public List<Category> getCategories(){
        return categoryRepository.findAll();
    }

    //delete category
    @Transactional
    public ResponseEntity<?> deleteCategory(Long id) {
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(id);

            if (!categoryOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Category not found");
            }

            // Find or create "Uncategorized" category
            Category uncategorized = categoryRepository.findByName("Uncategorized")
                    .orElseGet(() -> categoryRepository.save(new Category("Uncategorized")));

            // Reassign all donations from this category to "Uncategorized"
            List<Donation> donations = donationRepository.findByCategoryId(id);
            if (donations != null && !donations.isEmpty()) {
                for (Donation donation : donations) {
                    donation.setCategory(uncategorized);
                }
                donationRepository.saveAll(donations);
            }

            // Now safe to delete
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("Category deleted successfully. " + donations.size() + " donations reassigned to 'Uncategorized'.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category: " + e.getMessage());
        }
    }


    //update category (change name)
    public void updateCategory(Long id , Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existingCategory.setName(category.getName());
        categoryRepository.save(existingCategory);
    }

}
