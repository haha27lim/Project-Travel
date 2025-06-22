package com.example.springjwt.controllers;

import com.example.springjwt.models.ChatRequest;
import com.example.springjwt.models.ChatResponse;
import com.example.springjwt.service.AIChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    @Autowired
    private AIChatService aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> processChat(@RequestBody ChatRequest request) {
        String response = aiChatService.processMessage(
            request.getMessage(),
            request.isAuthenticated(),
            request.getUserId()
        );
        return ResponseEntity.ok(new ChatResponse(response));
    }
} 