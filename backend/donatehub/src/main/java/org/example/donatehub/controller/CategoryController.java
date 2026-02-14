package org.example.donatehub.controller;

import java.util.List;

import org.example.donatehub.entity.Category;
import org.example.donatehub.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1")
public class CategoryController {
     @Autowired
    private CategoryService categoryService;


    //get all 
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List <Category> categories = categoryService.getCategories();
        if  (categories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(categories);
    }


    //add new category 
    @PostMapping("/add/categories")
    public  ResponseEntity<?> addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    


}
