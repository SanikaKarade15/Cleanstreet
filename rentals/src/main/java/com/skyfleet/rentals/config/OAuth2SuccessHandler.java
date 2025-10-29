package com.skyfleet.rentals.config;

import com.skyfleet.rentals.entity.Role;
import com.skyfleet.rentals.entity.User;
import com.skyfleet.rentals.repository.UserRepository;
import com.skyfleet.rentals.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException, ServletException {
        
        // Get the OAuth2User from authentication principal
        Object principal = authentication.getPrincipal();
        User user;
        
        // Handle different user types properly
        if (principal instanceof OidcUser) {
            // Handle Google OAuth (OpenID Connect)
            OidcUser oidcUser = (OidcUser) principal;
            String email = oidcUser.getEmail();
            String name = oidcUser.getFullName() != null ? 
                         oidcUser.getFullName() : 
                         (oidcUser.getGivenName() + " " + oidcUser.getFamilyName());
            
            // Find or create user
            user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setRole(Role.USER);
                user.setPhone("000-000-0000");
                user.setAddress("Not provided");
                user.setPassword("OAUTH_USER");
                
                user = userRepository.save(user);
            }
        } else if (principal instanceof OAuth2User) {
            // Handling other OAuth2 providers (if you add them later)
            OAuth2User oauth2User = (OAuth2User) principal;
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            
            user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setRole(Role.USER);
                user.setPhone("000-000-0000");
                user.setAddress("Not provided");
                user.setPassword("OAUTH_USER");
                
                user = userRepository.save(user);
            }
        } else {
            throw new ServletException("Unsupported OAuth2User implementation: " + principal.getClass().getName());
        }
        
        //  Generate JWT token using the actual User entity
        String token = jwtUtil.generateToken(user, user.getId(), user.getRole().name());
        
        // Redirect to frontend with token
        String redirectUrl = "http://localhost:3000/oauth/callback?token=" + token + 
                           "&role=" + user.getRole().name();
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
