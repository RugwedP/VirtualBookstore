package com.myBookStoreProject.rugwedBookstore.Controller;




import java.io.IOException;


import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;
import com.myBookStoreProject.rugwedBookstore.Entities.BookValidation;
import com.myBookStoreProject.rugwedBookstore.Entities.Category;
import com.myBookStoreProject.rugwedBookstore.Repo.BookRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.CategoryRepo;
import com.myBookStoreProject.rugwedBookstore.Service.BookService;

import jakarta.servlet.http.HttpServletRequest;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;


import java.nio.file.Path;
import java.nio.file.Paths;
@RestController
@RequestMapping("/api/book")
@CrossOrigin(origins = "http://locahost:3000")
public class BookController {
	
	@Autowired
	private BookService service;
	
	@Autowired
	private BookRepo bookRepo;
	
	@Autowired
	private CategoryRepo categoryRepo;
	
	// add book
//	@PostMapping("/addBook")
//	public ResponseEntity<?> addBook(@RequestBody @Validated BookValidation book)
//	{
//		 return this.service.addBook(book);
//	}
	
	@PostMapping("/addBook")
	public ResponseEntity<?> addBoook(@RequestPart("book") @Validated BookValidation book, 
	                                   @RequestPart("image") MultipartFile image) throws IOException {
	    if (image.isEmpty()) {
	        return new ResponseEntity<>("Image is required", HttpStatus.BAD_REQUEST);
	    }

	    String imageUrl = service.storeImage(image); // Store image and get the URL
	    book.setImageUrl(imageUrl); // Set image URL to book
	    return ResponseEntity.ok(service.addBook(book));
	    
	}

	
	// add category
	@PostMapping("/addCategory/{categoryName}")
	public Category addCategory(@PathVariable("categoryName") String category)
	{
		return service.addCategory(category);
	}
	
	// get all category
	@GetMapping("/getAllCategory")
	public List<Category> getAllCategories()
	{
		return service.getAllCategory();
	}
	
	
	//search mechanism
	@GetMapping("/books/search")
	public Set<Book> getByNameOrByAuthorOrByCategory(@RequestParam String keyword)
	{
		return service.getByNameOrByAuthorOrByCategory(keyword);
	}
	

	// get books by name
//	@GetMapping("/getBook/{bName}")
//	public List<Book> getBooksByName(@PathVariable("bName")String bName  )
//	{
//		return this.service.getBookByName(bName);
//	}
	
	
	@DeleteMapping("/deleteBook/{bId}")
	public ResponseEntity<Book> deleteBookByName(@PathVariable("bId") int id)
	{
		 	this.bookRepo.deleteById(id);
		 	return new ResponseEntity<>(HttpStatus.OK);
	}
	
	//update book
	@PatchMapping("updateBook/{bId}")
	public ResponseEntity<?> updateBookByName(
	        @PathVariable("bId") int id,
	        @RequestPart("book") @Validated BookValidation updatedBookData,
	        @RequestPart(value = "image", required = false) MultipartFile image, 
	        HttpServletRequest request) throws IOException {

	    Optional<Book> existingBookOpt = bookRepo.findById(id);

	    if (existingBookOpt.isPresent()) {
	        Book existingBook = existingBookOpt.get();

	        if (image != null && !image.isEmpty()) {
	            String imageUrl = service.storeImage(image);
	            updatedBookData.setImageUrl(imageUrl);
	        } else {
	            updatedBookData.setImageUrl(existingBook.getImageUrl());
	        }

	        // Now update the book with the updatedBookData and return the response
	        return ResponseEntity.ok(service.updateBook(id, updatedBookData));
	    } else {
	        // If the book is not found, return a 404 Not Found response
	        return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
	    }
	}


	
	//get all books
	@GetMapping("/allBooks")
	public List<Book>getAllBooks()
	{
	   return this.service.getAllBooks();
	}

	@GetMapping("/category/{categoryId}")
	public ResponseEntity<List<Book>> getBooksByCategory(@PathVariable("categoryId") int categoryId)
	{
		System.out.println(categoryId);
		 List<Book>books=  this.service.findAllBooksByCategory(categoryId);
		   return new ResponseEntity<>(books,HttpStatus.OK);
	}
	
	@GetMapping("/{bookid}")
	public ResponseEntity<?> getBookById(@PathVariable("bookid") int bookId)
	{
		 return this.service.findBookById(bookId);
				 
	}
	
	@Value("${image.upload.dir:C:/myImages}")
    private String uploadDir;

    @GetMapping("/images/{fileName}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
    	System.out.println("INside the image mapping");
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/jpeg") 
                    .header(HttpHeaders.CONTENT_TYPE, "image/jpg")
                    .header(HttpHeaders.CONTENT_TYPE, "image/webp")// Adjust content type if needed
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
		
    @GetMapping("/getCategory")
    public ResponseEntity<?> getAllCategory()
    {
    	List<Category> categories= categoryRepo.findAll();
    	return new ResponseEntity<>(categories,HttpStatus.OK);
    }
}

