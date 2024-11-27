package com.myBookStoreProject.rugwedBookstore.Entities;

public class BookDto {
	 private Book book;
	    private String category;

	    // Constructors
	    public BookDto(Book book, String category) {
	        this.book = book;
	        this.category = category;
	    }

	    // Getters and Setters
	    public Book getBook() {
	        return book;
	    }

	    public void setBook(Book book) {
	        this.book = book;
	    }

	    public String getCategory() {
	        return category;
	    }

	    public void setCategory(String category) {
	        this.category = category;
	    }
}
