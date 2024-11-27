package com.myBookStoreProject.rugwedBookstore.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;
import com.myBookStoreProject.rugwedBookstore.Entities.BookDto;
import com.myBookStoreProject.rugwedBookstore.Entities.BookValidation;
import com.myBookStoreProject.rugwedBookstore.Entities.Category;
import com.myBookStoreProject.rugwedBookstore.Repo.BookRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.CategoryRepo;


@Service
@RefreshScope
public class BookService {

	@Autowired
	private BookRepo bookRepo;
	
	@Autowired
	private CategoryRepo categoryRepo;
	
	
	
	// getting single book
	public List<Book> getBookByName(String name)
	{
		 return bookRepo.findByNameContainingIgnoringCase(name);
		
	}
	
	// add new book
	public ResponseEntity<?> addBook(BookValidation bookValidation) {
	    String categoryName = bookValidation.getCategory();
	    Book book = new Book();
	    
	    Optional<Category> category = categoryRepo.findByName(categoryName);
	    
	    if (category.isPresent()) {
	        Category userCategory = category.get(); // Get the present value in category
	        
	        // Set the book details
	        book.setName(bookValidation.getName());
	        book.setAuthor(bookValidation.getAuthor());
	        book.setImageUrl(bookValidation.getImageUrl()); // Image URL from storeImage
	        book.setDescription(bookValidation.getDescription());
	        book.setPrice(bookValidation.getPrice());
	        book.setCategory(userCategory);
	        book.setNumberOfBooks(bookValidation.getNumberOfBooks());
	        
	        Book savedBook = bookRepo.save(book);
	        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
	    } else {
	        return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
	    }
	}


	// add category
	public Category addCategory(String category) {
	
		Optional<Category> categoryName=categoryRepo.findByName(category);
		
		if(categoryName.isPresent())
		{
			throw new RuntimeException("Category already present");
		}
		
		Category newCategory=new Category();
		newCategory.setName(category);
		
		return categoryRepo.save(newCategory);
	}

	
	// get all category
	public List<Category> getAllCategory() {
		
		List<Category> categories=categoryRepo.findAll();
		return categories;
	}

	// search mechanism
	public Set<Book> getByNameOrByAuthorOrByCategory(String keyword) {
		
//		return this.bookRepo.searchByKeyword(keyword);
		
		String[]keywords = keyword.split("\\s+");
		
		Set<Book> result= new HashSet<>();
		
		for (String word : keywords) {
			result.addAll(bookRepo.searchByKeyword(word));
			
		}
		return result;
	}

	// get all books
	public List<Book> getAllBooks() {
		List<Book> books=bookRepo.findAll();
		return books;
	}

	public List<Book> findAllBooksByCategory(int categoryId) {
	    System.out.println("Category ID: " + categoryId);
	    // Call the repository method to get books by category ID
	    List<Book> booksByCategory = categoryRepo.findByCategoryId(categoryId);
	    for (Book book : booksByCategory) {
			System.out.println(book);
		}
	    return booksByCategory;
	}

	//find single book
//	public Optional<?> findBookById(int bookId) {
//		
//		return this.bookRepo.findById(bookId).map(book -> new BookDto(book));
//		
//	}
	
	public ResponseEntity<?> findBookById(int bookId) {
		
		Optional<Book> book = bookRepo.findById(bookId);
		if (book.isPresent()) {
			Book book2 = new Book();
			book2 = book.get();
			System.out.println(book2.getName());
			System.out.println(book2.getAuthor());
			System.out.println(book2.getImageUrl());
			System.out.println(book2.getNumberOfBooks());
			System.out.println(book2.getCategory().getName());
			System.out.println(book2.getPrice());
			String category = book2.getCategory().getName();
			BookDto bookDto=new BookDto(book2, category);
			
			return new ResponseEntity<>(bookDto , HttpStatus.OK);
		}
		return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
	}
	
	public String storeImage(MultipartFile image) throws IOException {
		String folder = "C:/myImages/"; 	    
		String fileName = image.getOriginalFilename();
	    
	    // Create the directory if it does not exist
	    File imageDir = new File(folder);
	    if (!imageDir.exists()) {
	        imageDir.mkdirs();
	    }
	    
	    // Create the path where the image will be stored
	    Path path = Paths.get(folder + fileName);
	    
	    // Write the image bytes to the specified path
	    Files.write(path, image.getBytes());
	    
	    // Return the relative URL or complete path for the stored image
	    return "/images/" + fileName; // Assuming this will be your accessible path
	}
	
	public ResponseEntity<?> updateBook(int bookId,BookValidation updateBookData)
	{
		Optional<Book> existingBook = bookRepo.findById(bookId);
		String category = updateBookData.getCategory();
		
		Optional<Category> mycategory= categoryRepo.findByName(category);
		
		
		
		if (existingBook.isPresent()) {
			
			if (mycategory.isPresent()) {
				 
				Category category2= mycategory.get();
				Book bookToUpdate = existingBook.get();
				
				bookToUpdate.setName(updateBookData.getName());
				bookToUpdate.setAuthor(updateBookData.getAuthor());
				bookToUpdate.setPrice(updateBookData.getPrice());
				bookToUpdate.setNumberOfBooks(updateBookData.getNumberOfBooks());
				bookToUpdate.setCategory(category2);
				bookToUpdate.setDescription(updateBookData.getDescription());
				bookToUpdate.setImageUrl(updateBookData.getImageUrl());
				
				Book updatedBook= bookRepo.save(bookToUpdate);
				 
				 return new ResponseEntity<>(updatedBook,HttpStatus.OK);
			}
			else {
				 return new ResponseEntity<>("Category not found",HttpStatus.NOT_FOUND);
			}
			
		}
		else {
			
			return new ResponseEntity<>("Book not present",HttpStatus.NOT_FOUND);
		}
	}

	
	
}

