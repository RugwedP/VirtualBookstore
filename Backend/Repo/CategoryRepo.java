package com.myBookStoreProject.rugwedBookstore.Repo;

import java.util.List;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;
import com.myBookStoreProject.rugwedBookstore.Entities.Category;
public interface CategoryRepo extends JpaRepository<Category, Integer> {
	
	Optional<com.myBookStoreProject.rugwedBookstore.Entities.Category> findByName(String name);
	
	

	
	@Query("SELECT b FROM Book b WHERE b.category.id = :categoryId")
	List<Book> findByCategoryId(@Param("categoryId") int id);
}