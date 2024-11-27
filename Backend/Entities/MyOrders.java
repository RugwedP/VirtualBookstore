package com.myBookStoreProject.rugwedBookstore.Entities;




import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class MyOrders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long placedOrderId;
	
	private int bookId;
	
	private String bookName;
	
	private String imageUrl;
	
	
	private long oId;
	
	private int orderStatus;
	
	private int quantity;
	
	private int totalPrice;
	
	@ManyToOne
	private User user;
	
	private String date;
	
	private int price;
	
	private String confirmationStatus;
	
	  @OneToOne(mappedBy = "myOrders")
	  @JsonManagedReference
	   private OrderConfirmOrReject orderConfirmOrReject;
	  

	public OrderConfirmOrReject getOrderConfirmOrReject() {
		return orderConfirmOrReject;
	}

	public void setOrderConfirmOrReject(OrderConfirmOrReject orderConfirmOrReject) {
		this.orderConfirmOrReject = orderConfirmOrReject;
	}

	public String getConfirmationStatus() {
	    return confirmationStatus;
	}

	public void setConfirmationStatus(String confirmationStatus) {
	    this.confirmationStatus = confirmationStatus;
	}

	public long getPlacedOrderId() {
		return placedOrderId;
	}

	public void setPlacedOrderId(long placedOrderId) {
		this.placedOrderId = placedOrderId;
	}

	public int getBookId() {
		return bookId;
	}

	public void setBookId(int bookId) {
		this.bookId = bookId;
	}

	public String getBookName() {
		return bookName;
	}

	public void setBookName(String bookName) {
		this.bookName = bookName;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public long getoId() {
		return oId;
	}

	public void setoId(long oId) {
		this.oId = oId;
	}

	public int getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(int orderStatus) {
		this.orderStatus = orderStatus;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public int getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(int totalPrice) {
		this.totalPrice = totalPrice;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}
	
	

	public int getPrice() {
		return price;
	}

	
	public void setPrice(int price) {
		this.price = price;
	}
	
	
	

}
