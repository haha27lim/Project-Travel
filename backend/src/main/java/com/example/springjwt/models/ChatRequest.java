package com.example.springjwt.models;

public class ChatRequest {
    private String message;
    private boolean isAuthenticated;
    private String userId;

    public ChatRequest() {
    }

    public ChatRequest(String message, boolean isAuthenticated, String userId) {
        this.message = message;
        this.isAuthenticated = isAuthenticated;
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isAuthenticated() {
        return isAuthenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        isAuthenticated = authenticated;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
} 