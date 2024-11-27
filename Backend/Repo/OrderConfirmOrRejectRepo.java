package com.myBookStoreProject.rugwedBookstore.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myBookStoreProject.rugwedBookstore.Entities.OrderConfirmOrReject;

public interface OrderConfirmOrRejectRepo extends JpaRepository<OrderConfirmOrReject, Integer> {

}
