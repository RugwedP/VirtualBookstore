package com.myBookStoreProject.rugwedBookstore.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Cart {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	//private Long userId;
    private int  bookId;
    private String bookTitle;
    private String bookImageUrl;
    private String bookAuthor;
    private int price;
    private int quantity;
    
    @ManyToOne()
    private User user;
    
    
   
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	
public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	//	public Long getUserId() {
//		return userId;
//	}
//	public void setUserId(Long userId) {
//		this.userId = userId;
//	}
	public int getBookId() {
		return bookId;
	}
	public void setBookId(int bookId) {
		this.bookId = bookId;
	}
	public String getBookTitle() {
		return bookTitle;
	}
	public void setBookTitle(String bookTitle) {
		this.bookTitle = bookTitle;
	}
	public String getBookImageUrl() {
		return bookImageUrl;
	}
	public void setBookImageUrl(String bookImageUrl) {
		this.bookImageUrl = bookImageUrl;
	}
	public String getBookAuthor() {
		return bookAuthor;
	}
	public void setBookAuthor(String bookAuthor) {
		this.bookAuthor = bookAuthor;
	}
	
//	@Override
//	public String toString() {
//		return "Cart [id=" + id + ", userId=" + userId + ", bookId=" + bookId + ", bookTitle=" + bookTitle
//				+ ", bookImageUrl=" + bookImageUrl + ", bookAuthor=" + bookAuthor + ", quantity=" + quantity + "]";
//	}
//	public Cart() {
//		super();
//		// TODO Auto-generated constructor stub
//	}
    
    
}

