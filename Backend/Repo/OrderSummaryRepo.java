package com.myBookStoreProject.rugwedBookstore.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myBookStoreProject.rugwedBookstore.Entities.OrderSummary;
import com.myBookStoreProject.rugwedBookstore.Entities.User;

public interface OrderSummaryRepo extends JpaRepository<OrderSummary, Long> {
	
	Optional<OrderSummary> findByUserAndOId(User user,long oId);
}
