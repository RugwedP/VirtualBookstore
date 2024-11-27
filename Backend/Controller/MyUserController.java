package com.myBookStoreProject.rugwedBookstore.Controller;

import java.nio.channels.NonReadableChannelException;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.Flow.Publisher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.myBookStoreProject.rugwedBookstore.Entities.Book;
import com.myBookStoreProject.rugwedBookstore.Entities.Cart;
import com.myBookStoreProject.rugwedBookstore.Entities.MyOrders;
import com.myBookStoreProject.rugwedBookstore.Entities.OrderSummary;
import com.myBookStoreProject.rugwedBookstore.Entities.User;
import com.myBookStoreProject.rugwedBookstore.Entities.UserDto;
import com.myBookStoreProject.rugwedBookstore.Entities.UserValidation;
import com.myBookStoreProject.rugwedBookstore.Repo.BookRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.CartRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.CurrentLoginAdminRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.MyOrderRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.MyUserRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.OrderSummaryRepo;
import com.myBookStoreProject.rugwedBookstore.Service.BookService;
import com.myBookStoreProject.rugwedBookstore.Service.MyUserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://locahost:3000")
public class MyUserController {

	@Autowired
	private BookService service;
	
	@Autowired
	private BookRepo bookRepo;
	
	@Autowired
	private MyUserRepo myUserRepo;
	
	@Autowired
	private MyUserService myUserService;
	
	@Autowired
	private OrderSummaryRepo orderSummaryRepo;
	
	@Autowired
	private MyOrderRepo myOrderRepo;
	
	@Autowired
	private CurrentLoginAdminRepo currentLoginAdminRepo;
	
	@Autowired
	private CartRepo cartRepo;
	
	@GetMapping("/allBooks")
	public List<Book>getAllBooks()
	{
	   return this.service.getAllBooks();
	}
	
	@GetMapping("/category/{categoryId}")
	public ResponseEntity<List<Book>> getBooksByCategory(@PathVariable("categoryId") int categoryId)
	{
		System.out.println(categoryId);
		 List<Book>books=  this.service.findAllBooksByCategory(categoryId);
		   return new ResponseEntity<>(books,HttpStatus.OK);
	}
	

	@GetMapping("/{bookid}")
	public ResponseEntity<?> getBookById(@PathVariable("bookid") int bookId)
	{
		 return this.service.findBookById(bookId);
				 
	}
	
	
	@DeleteMapping("/removeOrderSummary/{email}/{oId}")
	public ResponseEntity<?>removeOrderSummary(@PathVariable("email") String email,@PathVariable("oId") long oId)
	{
		
		boolean isDeleted= myUserService.removeBookFromOrderSummary(email, oId);
		if (isDeleted) {
			return new ResponseEntity<>("Delete from order Summary",HttpStatus.OK);
		}
		return new ResponseEntity<>("Order summary not found",HttpStatus.NOT_FOUND);
	}
	
	@GetMapping("/pincode/{email}")
	public ResponseEntity<?> fetchPincode(@PathVariable("email") String email)
	{
		User user = myUserRepo.findByEmail(email);
		if (user!=null && user.getEmail()!= null) {
			return new ResponseEntity<>(user,HttpStatus.OK);
		}
		return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
	}
	
	@GetMapping("/phone/{email}")
	public ResponseEntity<?> getPhoneNum(@PathVariable("email") String email) {
		
		User user=myUserRepo.findByEmail(email);
		
		
		if (user != null && user.getEmail()!=null) {
			
			 return new ResponseEntity<>(user,HttpStatus.OK);
			 
			
		}
	
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	@PostMapping("/addOrderSummary/{email}/{bookId}")
	public ResponseEntity<?>addOrderSummary(@PathVariable("email") String email,@PathVariable("bookId") int bookId)
	{
		User user= myUserRepo.findByEmail(email);
		Optional<Book>  book = bookRepo.findById(bookId);
		
		if (book.isPresent()) {
			Book book2 = new Book();
			book2 = book.get();
		 return	myUserService.addOrderSummary(user, book2);
			
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	
	@GetMapping("/getOrderSummaryBook/{email}/{oId}")
	public ResponseEntity<?>getOrderSummary(@PathVariable("email") String email,@PathVariable("oId") int oId)
	{
		User user = myUserRepo.findByEmail(email);
		if (user!=null) {
			
			return new ResponseEntity<>( orderSummaryRepo.findByUserAndOId(user, oId),HttpStatus.OK);
			
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	@PutMapping("/orderSummary/updateProductQuanatiy/{updatedQuantity}/{email}/{oId}/{totalPrice}")
	public ResponseEntity<?>updateQuantityAndTotal(@PathVariable("updatedQuantity") int updatedQuantity,@PathVariable("email") String email,@PathVariable("oId") int oId,@PathVariable("totalPrice") int total)
	{
		User user= myUserRepo.findByEmail(email);
		if (user != null && user.getEmail()!=null) {
			
			return myUserService.updateProductQuatity(updatedQuantity, email, oId, total);
			 
			
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	@PostMapping("/placeOrder/{email}/{oId}")
	public ResponseEntity<?>placeOrder(@PathVariable("email") String email,@PathVariable("oId") long oId )
	{
		User user = myUserRepo.findByEmail(email);
		
		if (user!= null) {
			
			Optional<OrderSummary> optionalOrderSummary= orderSummaryRepo.findById(oId);
			if (optionalOrderSummary.isPresent()) {
				OrderSummary orderSummary=new OrderSummary();
				orderSummary = optionalOrderSummary.get();
				MyOrders myOrders=new MyOrders();
				
				
				myOrders.setBookId(orderSummary.getBookId());
				myOrders.setBookName(orderSummary.getBookName());
				myOrders.setImageUrl(orderSummary.getImageUrl());
				myOrders.setoId(oId);
				myOrders.setOrderStatus(0);
				myOrders.setPrice(orderSummary.getPrice());
				myOrders.setQuantity(orderSummary.getQuantity());
				myOrders.setTotalPrice(orderSummary.getTotalPrice());
				myOrders.setUser(user);
				SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
	            String currentDate = formatter.format(new Date());
	            myOrders.setDate(currentDate);
				
				myOrderRepo.save(myOrders);
				return new ResponseEntity<>("Order saved",HttpStatus.OK);
			}
			return new ResponseEntity<>("Order Summary not found",HttpStatus.NOT_FOUND);
			
		}
		
		return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
	}
	
	
	@PostMapping("/verifyUser")
	public ResponseEntity<?> verifyEmailAndPass(@RequestBody UserDto userDto)
	{
		System.out.println(userDto.getEmail());
		System.out.println(userDto.getPassword());
		String email=userDto.getEmail();
		String password=userDto.getPassword();
		
		if (email!=null && password!= null) {
			
		 return	myUserService.isUserPresent(email, password);
		}
		return	new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	
	@PostMapping("/addUser")
	public ResponseEntity<?> addNewUser(@RequestBody UserValidation userValidation)
	{
		return new ResponseEntity<>(myUserService.addUser(userValidation),HttpStatus.OK);
	}
	
	
	@GetMapping("/userDetails/{email}")
	public ResponseEntity<?>getUserDetails(@PathVariable("email") String email)
	{
		return new ResponseEntity<>(myUserRepo.findByEmail(email),HttpStatus.OK);
	}
	
	@PutMapping("/updateUser/{email}")
	public ResponseEntity<?>updateUserDeatails(@PathVariable("email") String email,@RequestBody UserValidation userValidation)
	{
		
			System.out.println("Username is "+userValidation.getUserName());
			System.out.println("Address is "+userValidation.getAddress());
			System.out.println("Username is "+userValidation.getEmail());
			System.out.println("Username is "+userValidation.getPinCode());
			System.out.println("Username is "+userValidation.getPhoneNum());
			System.out.println(userValidation.getAddress());
			User user = myUserRepo.findByEmail(email);
			if(user!= null && user.getEmail()!=null)
			{
				if (userValidation.getAddress()!=user.getAddress()) {
					user.setAddress(userValidation.getAddress());
				}
				
				if (userValidation.getEmail()!=user.getEmail()) {
					user.setEmail(userValidation.getEmail());
				}
				
				if (userValidation.getPhoneNum()!=user.getPhoneNum()) {
					user.setPhoneNum(userValidation.getPhoneNum());
				}
				if (userValidation.getUserName()!=null) {
					user.setUserName(userValidation.getUserName());
				}
				if (userValidation.getPinCode()!=user.getPinCode()) {
					user.setPinCode(userValidation.getPinCode());
				}
				
				myUserRepo.save(user);
				return new ResponseEntity<>("User updated s",HttpStatus.OK);
			}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);

	}
	
	@GetMapping("/getPlacedOrder/{email}")
	public ResponseEntity<?>getPlcaedOrder(@PathVariable("email") String email)
	{
		User user = myUserRepo.findByEmail(email);
			if (user != null && user.getEmail()!=null) {
				List<MyOrders>orders = myOrderRepo.findByUser(user);
			
			
				
				return new ResponseEntity<>(orders,HttpStatus.OK);
			}
			
		
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			
	}
	
	@GetMapping("/books/search")
	public Set<Book> getByNameOrByAuthorOrByCategory(@RequestParam String keyword)
	{
		return service.getByNameOrByAuthorOrByCategory(keyword);
	}
	
	
	@GetMapping("/userPlacedOrders")
	public ResponseEntity<?>userPlacedOrders()
	{
		List<MyOrders> userOrders= myOrderRepo.findAll();
		if (userOrders != null) {
			return new ResponseEntity<>(userOrders,HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping("/deleteAdminUsername")
	public ResponseEntity<?>deleteAdminUsername()
	{
		currentLoginAdminRepo.deleteAll();
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
	@PutMapping("/updateOrderStatus/{placedOrderId}/{orderStatus}")
	public ResponseEntity<?>updateOrderStatus(@PathVariable("placedOrderId") long placedOrderId,@PathVariable("orderStatus") int orderStatus)
	{
		Optional<MyOrders>  myOrders = myOrderRepo.findById(placedOrderId);
		
		if (myOrders.isPresent()) {
			MyOrders myOrders2=new MyOrders();
			myOrders2 = myOrders.get();
			myOrders2.setOrderStatus(orderStatus);
			
			myOrderRepo.save(myOrders2);
			return new ResponseEntity<>(myOrders2.getOrderStatus(),HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
		@GetMapping("/api/user/userPlacedOrders")
	 public List<MyOrders> getAllOrdersWithDetails() {
	        return myOrderRepo.findAllWithConfirmationDetails();
	    }

	@PostMapping("/placeCartBooks/{email}")
	public ResponseEntity<?>placeCartItems(@PathVariable("email") String email)
	{
		User user = myUserRepo.findByEmail(email);

		if (user!=null && user.getEmail()!=null) {
			
			Optional<List<Cart>> userCarts = cartRepo.findByUser(user);
			if (userCarts.isPresent()) {
				List<Cart> carts = userCarts.get();
				for (Cart cart : carts) {
					MyOrders myOrders=new MyOrders();
					OrderSummary orderSummary=new OrderSummary();
					orderSummary.setBookId(cart.getBookId());
					orderSummary.setBookName(cart.getBookTitle());
					orderSummary.setImageUrl(cart.getBookImageUrl());
					orderSummary.setPrice(cart.getPrice());
					orderSummary.setQuantity(cart.getQuantity());
					orderSummary.setTotalPrice(cart.getQuantity()* cart.getPrice());
					orderSummary.setUser(user);
					
					OrderSummary orderSummaryNew =  orderSummaryRepo.save(orderSummary);
					
					myOrders.setBookId(orderSummaryNew.getBookId());
					myOrders.setBookName(orderSummaryNew.getBookName());
			        Date date = new Date();
			        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
			        String formattedDate = simpleDateFormat.format(date);
					myOrders.setDate(formattedDate);
					myOrders.setImageUrl(orderSummaryNew.getImageUrl());
					myOrders.setoId(orderSummaryNew.getoId());
					myOrders.setOrderStatus(0);
					
					myOrders.setPrice(orderSummaryNew.getPrice());
					myOrders.setQuantity(orderSummaryNew.getQuantity());
					myOrders.setTotalPrice(orderSummaryNew.getTotalPrice());
					myOrders.setUser(user);
					
					myOrderRepo.save(myOrders);
					orderSummaryRepo.deleteAll();
					
			  }
				
				
				
				
			}
			return new ResponseEntity<>("cart items stored successfully",HttpStatus.OK);
		}
		return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
	}
}
