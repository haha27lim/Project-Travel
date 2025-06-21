package com.example.springjwt.payload.response;

import java.util.List;

public class UserInfoResponse {

	private Long id;
	private String username;
	private String email;
	private String imageUrl;
	private List<String> roles;

	public UserInfoResponse(Long id, String username, String email, String imageUrl, List<String> roles) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.imageUrl = null;
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<String> getRoles() {
		return roles;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
	
}