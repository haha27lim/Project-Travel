package com.example.springjwt.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springjwt.event.RegistrationCompleteEvent;
import com.example.springjwt.models.ERole;
import com.example.springjwt.models.Role;
import com.example.springjwt.models.User;
import com.example.springjwt.payload.request.LoginRequest;
import com.example.springjwt.payload.request.SignupRequest;
import com.example.springjwt.payload.response.UserInfoResponse;
import com.example.springjwt.payload.response.MessageResponse;
import com.example.springjwt.repository.RoleRepository;
import com.example.springjwt.repository.UserRepository;
import com.example.springjwt.security.jwt.JwtUtils;
import com.example.springjwt.security.services.UserDetailsImpl;
import com.example.springjwt.service.UserService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  private ApplicationEventPublisher publisher;

  @Autowired
  UserService userService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    UserInfoResponse responseBody = new UserInfoResponse(userDetails.getId(),
        userDetails.getUsername(),
        userDetails.getEmail(),
        userDetails.getPassword(),
        roles);

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(responseBody);
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest,
      final HttpServletRequest request) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "admin":
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);

            break;

          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request))); // send registration email

    return ResponseEntity
        .ok(new MessageResponse("User registered successfully! Please check your email for verification."));
  }

  public String applicationUrl(HttpServletRequest request) {
    return "http://" + request.getServerName() + ":"
        + request.getServerPort() + request.getContextPath();
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("You've been signed out!"));
  }

  @GetMapping("/user")
  public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal Object principal) {
    try {

      String username;
      if (principal instanceof UserDetails) {
        username = ((UserDetails) principal).getUsername();
      } else if (principal instanceof DefaultOAuth2User) {
        DefaultOAuth2User oauth2User = (DefaultOAuth2User) principal;
        String email = oauth2User.getAttribute("email");
        if (email == null) {
          return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED)
              .body(new MessageResponse("Email attribute not found"));
        }
        username = email.toString().split("@")[0];
      } else {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(new MessageResponse("No authenticated user found"));
      }

      User user = userService.findByUsername(username);
      if (user == null) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new MessageResponse("User not found"));
      }

      List<String> roles = SecurityContextHolder.getContext()
          .getAuthentication()
          .getAuthorities()
          .stream()
          .map(GrantedAuthority::getAuthority)
          .collect(Collectors.toList());

      UserInfoResponse response = new UserInfoResponse(
          user.getId(),
          user.getUsername(),
          user.getEmail(),
          user.getImageUrl(),
          roles);

      return ResponseEntity.ok().body(response);
    } catch (Exception e) {
      logger.error("Error getting user details: {}", e.getMessage());
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new MessageResponse("Error retrieving user details"));
    }
  }

  @GetMapping("/username")
  public String currentUserName(@AuthenticationPrincipal UserDetails userDetails) {
    return (userDetails != null) ? userDetails.getUsername() : "";
  }
}