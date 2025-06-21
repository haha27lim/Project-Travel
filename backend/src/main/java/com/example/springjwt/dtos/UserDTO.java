package com.example.springjwt.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.example.springjwt.models.Role;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String userName;
    private String email;
    private String imageUrl;
    private String signUpMethod;
    private Role role;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
