package com.myBookStoreProject.rugwedBookstore.Repo;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myBookStoreProject.rugwedBookstore.Entities.Cart;
import com.myBookStoreProject.rugwedBookstore.Entities.User;



@Repository
public interface CartRepo extends JpaRepository<Cart,Integer > {
	 Optional<List<Cart>>findByUser(User user);
		
		Optional<Cart> findByUserAndId(User user, long id);
}
