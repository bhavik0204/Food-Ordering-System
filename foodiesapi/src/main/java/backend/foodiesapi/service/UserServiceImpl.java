package backend.foodiesapi.service;
import org.springframework.security.core.Authentication;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.foodiesapi.enums.Role;
import backend.foodiesapi.entity.UserEntity;
import backend.foodiesapi.io.UserRequest;
import backend.foodiesapi.io.UserResponse;
import backend.foodiesapi.repository.UserRepository;
import backend.foodiesapi.exception.UnauthorizedException;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        // Convert UserRequest to User entity and save it to the repository
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser); // saves to MySQL
        return convertToResponse(newUser);
    }

    @Override
    public Long findByUserId() { // Changed to Long for better consistency
        Authentication auth = authenticationFacade.getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("User not authenticated");
        }
        
        String loggedInUserEmail = auth.getName();
        UserEntity loggedInUser = userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loggedInUserEmail));
        return loggedInUser.getId();
    }

    @Override
    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private UserEntity convertToEntity(UserRequest request) {
        Role userRole = Role.CUSTOMER;
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                userRole = Role.valueOf(request.getRole().toUpperCase().replace("ROLE_", ""));
            } catch (IllegalArgumentException e) {
                userRole = Role.CUSTOMER;
            }
        }
        
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(userRole)
                .build();
    }

    private UserResponse convertToResponse(UserEntity registeredUser) {
        return UserResponse.builder()
                .id(String.valueOf(registeredUser.getId()))
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .role(registeredUser.getRole() != null ? registeredUser.getRole().name() : "CUSTOMER")
                .build();
    }
}
