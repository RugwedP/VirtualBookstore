package com.myBookStoreProject.rugwedBookstore.Entities;

import jakarta.persistence.OneToOne;

public class OrderConfirmOrRejectValidation {

	private int isOrderConfirm;
	
	

	@OneToOne
	private MyOrders myOrders;

	public int getIsOrderConfirm() {
		return isOrderConfirm;
	}

	public void setIsOrderConfirm(int isOrderConfirm) {
		this.isOrderConfirm = isOrderConfirm;
	}

	

	public MyOrders getMyOrders() {
		return myOrders;
	}

	public void setMyOrders(MyOrders myOrders) {
		this.myOrders = myOrders;
	}

	
	
	
}
