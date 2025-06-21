package com.example.springjwt.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "username"),
    @UniqueConstraint(columnNames = "email")
})
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  @NotBlank
  @Size(max = 20)
  @Column(name = "username")
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  @Column(name = "email")
  private String email;

  @Size(max = 120)
  @Column(name = "password")
  @JsonIgnore
  private String password;

  private String imageUrl;

  private String signUpMethod;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdDate;

  @UpdateTimestamp
  private LocalDateTime updatedDate;

  public User() {
  }

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  public User(String username, String email) {
    this.username = username;
    this.email = email;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getSignUpMethod() {
    return signUpMethod;
  }

  public void setSignUpMethod(String signUpMethod) {
    this.signUpMethod = signUpMethod;
  }

  public LocalDateTime getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(LocalDateTime createdDate) {
    this.createdDate = createdDate;
  }

  public LocalDateTime getUpdatedDate() {
    return updatedDate;
  }

  public void setUpdatedDate(LocalDateTime updatedDate) {
    this.updatedDate = updatedDate;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (!(o instanceof User))
      return false;
    return id != null && id.equals(((User) o).getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
