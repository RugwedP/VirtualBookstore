package com.myBookStoreProject.rugwedBookstore.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;
import com.myBookStoreProject.rugwedBookstore.Entities.OrderSummary;
import com.myBookStoreProject.rugwedBookstore.Entities.User;
import com.myBookStoreProject.rugwedBookstore.Entities.UserValidation;
import com.myBookStoreProject.rugwedBookstore.Repo.MyUserRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.OrderSummaryRepo;



@Service
public class MyUserService {
	
	@Autowired
	private MyUserRepo myUserRepo;
	
	@Autowired
	private OrderSummaryRepo orderSummaryRepo;
	
	private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

	//add user
	public ResponseEntity<User> addUser(UserValidation userValidation) {
		System.out.println(userValidation);
		
		User user = new User();
		user.setPassword(encoder.encode(userValidation.getPassword()));
		user.setConfirmPassword(encoder.encode(userValidation.getConfirmPassword()));
		user.setEmail(userValidation.getEmail());
		
		user.setPinCode(userValidation.getPinCode());
		System.out.println("Pincode"+userValidation.getPinCode());
		
		user.setAddress(userValidation.getAddress());
		
		user.setUserName(userValidation.getUserName());
		user.setPhoneNum(userValidation.getPhoneNum());
		System.out.println("Username is"+userValidation.getUserName());
		
		this.myUserRepo.save(user);
		
		return new ResponseEntity<>(user,HttpStatus.OK);
	}

	// check user 
	public ResponseEntity<?> isUserPresent(String email, String password) {
		
		
		User user = this.myUserRepo.findByEmail(email);
		if(user!= null && encoder.matches(password, user.getPassword()))
		{
			return new ResponseEntity<>(user,HttpStatus.OK);
		}
		return new ResponseEntity<>("User Not found",HttpStatus.NOT_FOUND);

		
	}

	//add to order summary
	public ResponseEntity<?> addOrderSummary(User user, Book book) {
		
		OrderSummary orderSummary = new OrderSummary();
		orderSummary.setBookId(book.getId());
		orderSummary.setBookName(book.getName());
		orderSummary.setImageUrl(book.getImageUrl());
		orderSummary.setPrice(book.getPrice());
		orderSummary.setQuantity(1);
		orderSummary.setTotalPrice(book.getPrice());
		orderSummary.setUser(user);
		orderSummaryRepo.save(orderSummary);
		 
		 return new ResponseEntity<>(orderSummary,HttpStatus.OK);
	}
	
	// remove order summary
	public boolean removeBookFromOrderSummary(String email, long oId) {
        User user = myUserRepo.findByEmail(email);
        if (user == null) {
            return false;
        }

        Optional<OrderSummary> orderSummaryOptional = orderSummaryRepo.findByUserAndOId(user, oId);
        if (orderSummaryOptional.isPresent()) {
            orderSummaryRepo.delete(orderSummaryOptional.get());
            return true;
        }
        return false;
    }

	//update product quantity
	public ResponseEntity<?> updateProductQuatity(int quantity,String email, long oId,int totalPrice) {
		 User user = myUserRepo.findByEmail(email);
		Optional<OrderSummary> orderOptional = orderSummaryRepo.findByUserAndOId(user, oId);
		if (orderOptional.isPresent()) {
			OrderSummary orderSummary = new OrderSummary(); 
			orderSummary = orderOptional.get();
			orderSummary.setQuantity(quantity);
			orderSummary.setTotalPrice(totalPrice);
			orderSummaryRepo.save(orderSummary);
			return new ResponseEntity<>(orderSummary,HttpStatus.OK); 
		}
		
		return new ResponseEntity<>("Book quatity not updated",HttpStatus.NOT_FOUND); 
	}

}
