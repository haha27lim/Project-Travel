package com.example.springjwt.event;

import lombok.*;
import org.springframework.context.ApplicationEvent;

import com.example.springjwt.models.User;


@Getter
@Setter
public class RegistrationCompleteEvent extends ApplicationEvent {
    
    private User user;
    private String applicationUrl;


    public RegistrationCompleteEvent(User user, String applicationUrl) {
        super(user);
        this.user = user;
        this.applicationUrl = applicationUrl;
    }
}
