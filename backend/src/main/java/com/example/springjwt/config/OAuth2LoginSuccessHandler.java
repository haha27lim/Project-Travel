package com.example.springjwt.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.springjwt.models.ERole;
import com.example.springjwt.models.Role;
import com.example.springjwt.models.User;
import com.example.springjwt.repository.RoleRepository;
import com.example.springjwt.security.jwt.JwtUtils;
import com.example.springjwt.security.services.UserDetailsImpl;
import com.example.springjwt.service.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private final UserService userService;

    @Autowired
    private final JwtUtils jwtUtils;

    @Autowired
    RoleRepository roleRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    String username;
    String idAttributeKey;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();
            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();
            if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = email.split("@")[0];
                idAttributeKey = "sub";
            } else {
                username = "";
                idAttributeKey = "id";
            }
            System.out.println("HELLO OAUTH: " + email + " : " + name + " : " + username);

            userService.findByEmail(email)
                    .ifPresentOrElse(user -> {
                        String roleName = user.getRoles().stream()
                                .map(role -> role.getName().name())
                                .findFirst()
                                .orElse(ERole.ROLE_USER.name());

                        DefaultOAuth2User oauthUser = new DefaultOAuth2User(
                                List.of(new SimpleGrantedAuthority(roleName)),
                                attributes,
                                idAttributeKey);

                        Authentication securityAuth = new OAuth2AuthenticationToken(
                                oauthUser,
                                List.of(new SimpleGrantedAuthority(roleName)),
                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    }, () -> {
                        User newUser = new User();
                        Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER); // Fetch existing role
                        if (userRole.isPresent()) {
                            newUser.setRoles(java.util.Collections.singleton(userRole.get())); // Set existing role
                        } else {
                            
                            throw new RuntimeException("Default role not found");
                        }
                        newUser.setEmail(email);
                        newUser.setUsername(username);
                        newUser.setSignUpMethod(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                        userService.registerUser(newUser);
                        DefaultOAuth2User oauthUser = new DefaultOAuth2User(
                                List.of(new SimpleGrantedAuthority(ERole.ROLE_USER.name())),
                                attributes,
                                idAttributeKey);
                        Authentication securityAuth = new OAuth2AuthenticationToken(
                                oauthUser,
                                List.of(new SimpleGrantedAuthority(ERole.ROLE_USER.name())),
                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    });
        }

        // === COOKIE LOGIC (REPLACES JWT TOKEN LOGIC) ===
        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");

        System.out.println("OAuth2LoginSuccessHandler: " + username + " : " + email);

        
        UserDetailsImpl userDetails = new UserDetailsImpl(
                null,
                username,
                email,
                null,
                authentication.getAuthorities());

        
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
        
        response.addHeader("Set-Cookie", jwtCookie.toString());
        
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/redirect")
        .build().toUriString();
        
        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}