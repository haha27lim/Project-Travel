package com.example.springjwt.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springjwt.exception.NotFoundException;
import com.example.springjwt.models.ERole;
import com.example.springjwt.models.PasswordResetToken;
import com.example.springjwt.models.Role;
import com.example.springjwt.models.User;
import com.example.springjwt.repository.PasswordResetTokenRepository;
import com.example.springjwt.repository.RoleRepository;
import com.example.springjwt.repository.UserRepository;
import com.example.springjwt.security.services.EmailServiceImpl;

@Service
public class UserService {

	@Value("${frontend.url}")
	String frontendUrl;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private EmailServiceImpl emailServiceImpl;


	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	@Transactional
	public User saveUser(User user) {
		return userRepo.save(user);
	}

	public User getUserById(Long id) {
		return userRepo.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
	}

	@Transactional
	public User updateUser(User user) {
		return userRepo.save(user);
	}

	@Transactional
	public void deleteUserById(Long id) {
		User user = userRepo.findById(id).orElse(null);
		if (user == null) {
			throw new NotFoundException("User not found.");
		}
		userRepo.deleteById(id);
	}

	public void updateUserRole(Long userId, String roleName) {
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		ERole appRole = ERole.valueOf(roleName);
		Role role = roleRepo.findByName(appRole)
				.orElseThrow(() -> new RuntimeException("Role not found"));
		user.setRoles(java.util.Collections.singleton(role));
		userRepo.save(user);
	}

	public User findByUsername(String username) {
		Optional<User> user = userRepo.findByUsername(username);
		return user.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
	}

	public List<Role> getAllRoles() {
		return roleRepo.findAll();
	}

	public void updatePassword(Long userId, String password) {
		try {
			User user = userRepo.findById(userId)
					.orElseThrow(() -> new RuntimeException("User not found"));
			user.setPassword(passwordEncoder.encode(password));
			userRepo.save(user);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update password");
		}
	}

	public void generatePasswordResetToken(String email) {
		User user = userRepo.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found!"));

		String token = UUID.randomUUID().toString();
		Instant expiryDate = Instant.now().plus(24, ChronoUnit.HOURS);

		PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
		passwordResetTokenRepository.save(resetToken);

		String resetUrl = frontendUrl + "/reset-password?token=" + token;
		
		emailServiceImpl.sendPasswordResetEmail(user.getEmail(), resetUrl);
	}

	public void resetPassword(String token, String newPassword) {
		PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
				.orElseThrow(() -> new RuntimeException("Invalid Password reset Token!"));

		if (resetToken.isUsed())
			throw new RuntimeException("Password reset token has already been used");

		if (resetToken.getExpiryDate().isBefore(Instant.now()))
			throw new RuntimeException("Password reset token has expired");

		User user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(newPassword));
		userRepo.save(user);

		resetToken.setUsed(true);
		passwordResetTokenRepository.save(resetToken);
	}

	public Optional<User> findByEmail(String email) {
		return userRepo.findByEmail(email);
	}

	@Transactional
	public User registerUser(User user) {
		if (user.getPassword() != null)
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepo.save(user);
	}
}
