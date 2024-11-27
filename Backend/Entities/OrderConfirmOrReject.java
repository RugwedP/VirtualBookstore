package com.myBookStoreProject.rugwedBookstore.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class OrderConfirmOrReject {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	
	private int isOrderConfirm;
	
	

	@OneToOne
	@JsonIgnore
	private MyOrders myOrders;

	private String adminUsername;
	
	private String date;
	
	
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getAdminUsername() {
		return adminUsername;
	}

	public void setAdminUsername(String adminUsername) {
		this.adminUsername = adminUsername;
	}

	public MyOrders getMyOrders() {
		return myOrders;
	}

	public void setMyOrders(MyOrders myOrders) {
		this.myOrders = myOrders;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getIsOrderConfirm() {
		return isOrderConfirm;
	}

	public void setIsOrderConfirm(int isOrderConfirm) {
		this.isOrderConfirm = isOrderConfirm;
	}

	

	
}
