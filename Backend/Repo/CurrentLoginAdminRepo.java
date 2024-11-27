package com.myBookStoreProject.rugwedBookstore.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myBookStoreProject.rugwedBookstore.Entities.CurrentLoginAdmin;

@Repository
public interface CurrentLoginAdminRepo extends JpaRepository<CurrentLoginAdmin, Integer> {
	
}
