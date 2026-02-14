package org.example.donatehub.service;

import java.util.List;

import org.example.donatehub.entity.Category;
import org.example.donatehub.repo.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

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

    //update category


<<<<<<< Updated upstream
    //update category (change name)
    public void updateCategory(Long id , Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existingCategory.setName(category.getName());
        categoryRepository.save(existingCategory);
    }

=======
>>>>>>> Stashed changes
}
