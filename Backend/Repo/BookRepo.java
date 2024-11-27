package com.myBookStoreProject.rugwedBookstore.Repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;


public interface BookRepo extends JpaRepository<Book, Integer> {
	
	
	List<Book> findByNameContainingIgnoringCase(String name);
	
	
	 @Query("SELECT b FROM Book b WHERE " +
	           "LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
	           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
	           "LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	    Set<Book> searchByKeyword(@Param("keyword") String keyword);
	 
	 
	
	
}