package backend.foodiesapi.util;

import backend.foodiesapi.entity.RestaurantEntity;
import backend.foodiesapi.repository.RestaurantRepository;
import backend.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AuthorizationUtil {

    private final RestaurantRepository restaurantRepository;
    private final UserService userService;

    public boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    public boolean isRestaurantOwner() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_RESTAURANT_OWNER"));
    }

    public boolean ownsRestaurant(Long restaurantId) {
        if (isAdmin()) return true;
        if (!isRestaurantOwner()) return false;

        Long currentUserId = userService.findByUserId();
        return restaurantRepository.findById(restaurantId)
                .map(restaurant -> restaurant.getOwnerId().equals(currentUserId))
                .orElse(false);
    }

    public Long getCurrentUserRestaurantId() {
        Long currentUserId = userService.findByUserId();
        return restaurantRepository.findByOwnerId(currentUserId)
                .map(RestaurantEntity::getId)
                .orElse(null);
    }
}
