package com.myBookStoreProject.rugwedBookstore.Controller;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.myBookStoreProject.rugwedBookstore.Entities.Cart;
import com.myBookStoreProject.rugwedBookstore.Entities.User;
import com.myBookStoreProject.rugwedBookstore.Repo.BookRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.CartRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.MyUserRepo;
import com.myBookStoreProject.rugwedBookstore.Service.CartService;



@RequestMapping("/api/cart")
@RestController
@CrossOrigin(origins = {"http://localhost:3001","http://localhost:3000","https://api.postalpincode.in/pincode"})
public class CartController {
	
	@Autowired
	private BookRepo bookRepo;
	
	@Autowired
	private CartService cartService;
	
	@Autowired
	private MyUserRepo myUserRepo;
	
	@Autowired
	private CartRepo cartRepo;
	
	@Autowired
    private RestTemplate restTemplate;
	
	@PostMapping("/{bookId}/{email}")
	public ResponseEntity<?> addToCart(@PathVariable("bookId") int bookId,@PathVariable("email") String email){
		
		
	   User user = myUserRepo.findByEmail(email);
		
		if (user != null && user.getEmail()!=null) {
			
			return cartService.addBookToCart(bookId,user);
			
		}
		else {
			return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
		}
		
		
		
	}
	
	@GetMapping("/{email}")
    public ResponseEntity<?> getCartItems(@PathVariable("email") String email) {
		
		User user= myUserRepo.findByEmail(email);
		if (user != null && user.getEmail()!=null) {
			
			
			
			
			return new ResponseEntity<>(cartService.getCartItems(user), HttpStatus.OK);
		}
		else {
			
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			
		}
    }
	
	//remove user
	@PostMapping("/remove/{email}/{cartId}")
	public ResponseEntity<?> removeCartItem(@PathVariable("cartId") int cartId,@PathVariable("email") String email)
	{
			
		User user= myUserRepo.findByEmail(email);
		if (user != null && user.getEmail()!=null) {
			
			  return cartService.removeCartItem(user,cartId);
			  
			 
			
		}
	
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
		
		
	}

	@GetMapping("/pincode/{pincode}")
	public ResponseEntity<?> getPincodeData(@PathVariable("pincode") String pincode) {
		System.out.println("Inside the pincode fetch");
	    String url = "https://api.postalpincode.in/pincode/" + pincode;
	    
	    try {
	        RestTemplate restTemplate = new RestTemplate();
	        ResponseEntity<Object[]> response = restTemplate.getForEntity(url, Object[].class);
	        
	        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
	            return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>("No data found for the provided pincode", HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        return new ResponseEntity<>("Failed to retrieve pincode data", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	    
	}

	@PostMapping("/quantity/{quatity}/{email}/{cartId}")
	public ResponseEntity<?> setQuantity(@PathVariable("quatity") int quantity,@PathVariable("email")String email,@PathVariable("cartId")int cartId)
	{
		User user = myUserRepo.findByEmail(email);
		if (user!=null) {
		  Optional<Cart> cartOptional=cartRepo.findById(cartId);
		  if (cartOptional.isPresent()) {
			Cart cart = new Cart();
			cart = cartOptional.get();
			cart.setQuantity(quantity);
			cartRepo.save(cart);
			return new ResponseEntity<>("Quantity updated",HttpStatus.OK);
			
		 }
		}
		
			return new ResponseEntity<>("Quantity updated",HttpStatus.NOT_FOUND);
		
		
	}
	
	
	
}