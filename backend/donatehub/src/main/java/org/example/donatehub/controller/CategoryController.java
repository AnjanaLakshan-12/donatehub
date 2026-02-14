package org.example.donatehub.controller;

import java.util.List;

import org.example.donatehub.entity.Category;
import org.example.donatehub.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1")
public class CategoryController {

     @Autowired
    private CategoryService categoryService;


    //get all /api/categories
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List <Category> categories = categoryService.getCategories();
        if  (categories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(categories);
    }


    //add new category   /api/categories
    @PostMapping("/add/categories")
    public  ResponseEntity<?> addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    //delete category
    @DeleteMapping("/delete/category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try{
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().body("Category deleted successfully");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //update category(change name)
    @PutMapping("/update/category/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try{
            categoryService.updateCategory(id , category);
            return ResponseEntity.ok().body("Category updated successfully");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()+" Category not found");
        }

    }


}
