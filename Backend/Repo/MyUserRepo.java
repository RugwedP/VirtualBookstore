package com.myBookStoreProject.rugwedBookstore.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.myBookStoreProject.rugwedBookstore.Entities.User;

import java.util.Optional;


@Repository
public interface MyUserRepo extends JpaRepository<User,Integer> {
	
		User findByEmail(String email);
		Optional<User> findByUserName(String userName);
}