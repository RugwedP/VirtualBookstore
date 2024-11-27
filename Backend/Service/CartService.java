package com.myBookStoreProject.rugwedBookstore.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;
import com.myBookStoreProject.rugwedBookstore.Entities.Cart;
import com.myBookStoreProject.rugwedBookstore.Entities.User;
import com.myBookStoreProject.rugwedBookstore.Repo.BookRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.CartRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.MyUserRepo;

@Service
public class CartService {
	
	@Autowired
	private CartRepo cartRepo;
	
	@Autowired
	private MyUserRepo myUserRepo;
	
	@Autowired
	private BookRepo bookRepo;

	public ResponseEntity<?> addBookToCart(int bookId, User user) {
		
		Optional<Book> bookOptional = bookRepo.findById(bookId);
		if (bookOptional.isPresent()) {
			Book book =bookOptional.get();
			Cart cart=new Cart();
			
			book = bookOptional.get();
			
			cart.setBookId(book.getId());
			cart.setBookAuthor(book.getAuthor());
			cart.setBookImageUrl(book.getImageUrl());
			cart.setBookTitle(book.getName());
			cart.setQuantity(1);
			cart.setPrice(book.getPrice());
			cart.setUser(user);
			
			cartRepo.save(cart);
			
			return new ResponseEntity<>(HttpStatus.OK);
			
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);

	}

	
	public ResponseEntity<?> getCartItems(User user) {
		
	 Optional<List<Cart>> carts= cartRepo.findByUser(user);
	 if(carts.isPresent())
	 {
		 List<Cart> cart = carts.get();
		 return new ResponseEntity<>(cart,HttpStatus.OK);
	 }
	 return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}


	public ResponseEntity<?> removeCartItem(User user, int cartId) {
		
	 Optional<Cart>	 opCart= cartRepo.findByUserAndId(user, cartId);
	 if (opCart.isPresent()) {
		Cart cart=new Cart();
		cart=opCart.get();
		 cartRepo.delete(cart);
		 return new ResponseEntity<>(HttpStatus.OK);
	 }
	 
	 return new ResponseEntity<>("Cart not found",HttpStatus.NOT_FOUND);
	
	}

}
