package com.example.springjwt.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springjwt.exception.NotFoundException;
import com.example.springjwt.models.User;
import com.example.springjwt.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

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
}
