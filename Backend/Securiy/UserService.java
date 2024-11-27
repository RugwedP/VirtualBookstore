package com.myBookStoreProject.rugwedBookstore.Securiy;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.myBookStoreProject.rugwedBookstore.Entities.CurrentLoginAdmin;
import com.myBookStoreProject.rugwedBookstore.Repo.CurrentLoginAdminRepo;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private UserRepo repo;
    
    @Autowired
    private CurrentLoginAdminRepo currentLoginAdminRepo;


    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return user;
    }

    public String verify(Users user) {
    	
    	Users users=repo.findByUsername(user.getUsername());
    	if (!users.getUsername().equals(user.getUsername())) {
			return "fail";
		}
    	
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
      if (authentication.isAuthenticated()) {
        	CurrentLoginAdmin currentLoginAdmin=new CurrentLoginAdmin();
        	currentLoginAdmin.setUsername(user.getUsername());
        	currentLoginAdminRepo.save(currentLoginAdmin);
            return jwtService.generateToken(user.getUsername());
        } else {
            return "fail";
        }
    }
}
