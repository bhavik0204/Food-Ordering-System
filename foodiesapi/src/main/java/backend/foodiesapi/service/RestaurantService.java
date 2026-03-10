package backend.foodiesapi.service;

import backend.foodiesapi.entity.RestaurantEntity;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface RestaurantService {
    RestaurantEntity createRestaurant(RestaurantEntity restaurant, MultipartFile file);
    List<RestaurantEntity> getAllRestaurants();
    RestaurantEntity getRestaurantById(Long id);
    RestaurantEntity updateRestaurant(Long id, RestaurantEntity restaurant, MultipartFile file);
    void deleteRestaurant(Long id);
    RestaurantEntity getRestaurantByOwnerId(Long ownerId);
    RestaurantEntity getMyRestaurant();
}
