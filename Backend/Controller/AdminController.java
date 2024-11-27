package com.myBookStoreProject.rugwedBookstore.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myBookStoreProject.rugwedBookstore.Entities.CurrentLoginAdmin;
import com.myBookStoreProject.rugwedBookstore.Entities.MyOrders;
import com.myBookStoreProject.rugwedBookstore.Entities.OrderConfirmOrReject;
import com.myBookStoreProject.rugwedBookstore.Entities.OrderConfirmOrRejectValidation;
import com.myBookStoreProject.rugwedBookstore.Repo.CurrentLoginAdminRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.MyOrderRepo;
import com.myBookStoreProject.rugwedBookstore.Repo.OrderConfirmOrRejectRepo;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/admin/")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

	@Autowired
	private MyOrderRepo myOrderRepo;
	
	@Autowired
	private CurrentLoginAdminRepo currentLoginAdminRepo;
	
	@Autowired
	private OrderConfirmOrRejectRepo orderConfirmOrRejectRepo;
	
	@PostMapping("isOrderConfirmOrRejectByAdmin/{placedOrderId}/{isConfirm}/{adminUserName}")
	public ResponseEntity<?> insertConfirmOrRejectData(@PathVariable("placedOrderId") long placedId,
	                                                   @PathVariable("isConfirm") int isConfirm,
	                                                   @PathVariable("adminUserName") String adminUserName
	                                                  	) {
		 Optional<MyOrders> myOrders = myOrderRepo.findById(placedId);
		    if (myOrders.isPresent()) {
		        MyOrders order = myOrders.get();
		        OrderConfirmOrReject orderConfirmOrReject = new OrderConfirmOrReject();
		        orderConfirmOrReject.setMyOrders(order);
		        orderConfirmOrReject.setIsOrderConfirm(isConfirm);
		        orderConfirmOrReject.setAdminUsername(adminUserName);

		        // Format the current date as dd/MM/yyyy
		        Date date = new Date();
		        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
		        String formattedDate = simpleDateFormat.format(date);
		        orderConfirmOrReject.setDate(formattedDate);

		        // Set the confirmation status
		        String status = isConfirm == 1 ? "confirmed" : "rejected";
		        order.setConfirmationStatus(status);
		        myOrderRepo.save(order); // Save the updated status to the database

		        orderConfirmOrRejectRepo.save(orderConfirmOrReject);
		        return new ResponseEntity<>(orderConfirmOrReject, HttpStatus.OK);
	    }
	    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	
	@GetMapping("getCurrentAdminUsername")
	public ResponseEntity<?> fetchCurrectAdmin()
	{
		List<CurrentLoginAdmin>currentLoginAdmins = currentLoginAdminRepo.findAll();
		return new ResponseEntity<>(currentLoginAdmins,HttpStatus.OK);
	}	
	
	@PostMapping("rejectOrder/{placedOrderId}/{isConfirm}/{adminUserName}")
	public ResponseEntity<?> rejectOrder(@PathVariable("placedOrderId") long placedId,@PathVariable("isConfirm")int isConfirm,@PathVariable("adminUserName")String adminUserName)
	{
		System.out.println("Is order confirm"+isConfirm);
		Optional<MyOrders>  myOrders = myOrderRepo.findById(placedId);
		if(myOrders.isPresent())
		{
			MyOrders myOrders2=new MyOrders();
			myOrders2 = myOrders.get();
			OrderConfirmOrReject orderConfirmOrReject=new OrderConfirmOrReject();
			
			
			orderConfirmOrReject.setMyOrders(myOrders2);
			orderConfirmOrReject.setIsOrderConfirm(isConfirm);
			orderConfirmOrReject.setAdminUsername(adminUserName);
			
			orderConfirmOrRejectRepo.save(orderConfirmOrReject);
			return new ResponseEntity<>("Confirm or reject stored successfully",HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	
	@GetMapping("confirmOrRejectStatus/{orderConfId}")
	public ResponseEntity<?> getMethodName(@PathVariable("orderConfId") int id ) {
		Optional<OrderConfirmOrReject>  orderConfirmOrReject=orderConfirmOrRejectRepo.findById(id);
		if (orderConfirmOrReject.isPresent()) {
			OrderConfirmOrReject orderConfirmOrReject2=new OrderConfirmOrReject();
			orderConfirmOrReject2 = orderConfirmOrReject.get();
			
			return new ResponseEntity<>(orderConfirmOrReject2.getIsOrderConfirm(),HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		
	}
	
	
	
	
}
