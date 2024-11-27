package com.myBookStoreProject.rugwedBookstore.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.myBookStoreProject.rugwedBookstore.Entities.MyOrders;
import com.myBookStoreProject.rugwedBookstore.Entities.User;

public interface MyOrderRepo extends JpaRepository<MyOrders, Long> {
	List<MyOrders> findByUser(User user);
	
	
	@Query("SELECT o FROM MyOrders o LEFT JOIN FETCH o.orderConfirmOrReject")
    List<MyOrders> findAllWithConfirmationDetails();
	
	
	
}
