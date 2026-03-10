package backend.foodiesapi.service;

import backend.foodiesapi.entity.RestaurantEntity;
import backend.foodiesapi.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserService userService;
    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return null;
            }
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    @Override
    public RestaurantEntity createRestaurant(RestaurantEntity restaurant, MultipartFile file) {
        if (restaurant.getIsActive() == null) {
            restaurant.setIsActive(true);
        }
        if (restaurant.getCreatedAt() == null) {
            restaurant.setCreatedAt(java.time.LocalDateTime.now());
        }
        
        String imageUrl = uploadFile(file);
        restaurant.setImageUrl(imageUrl);
        
        return restaurantRepository.save(restaurant);
    }

    @Override
    public List<RestaurantEntity> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Override
    public RestaurantEntity getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    @Override
    public RestaurantEntity updateRestaurant(Long id, RestaurantEntity restaurant, MultipartFile file) {
        RestaurantEntity existing = getRestaurantById(id);
        existing.setName(restaurant.getName());
        existing.setDescription(restaurant.getDescription());
        existing.setAddress(restaurant.getAddress());
        existing.setPhoneNumber(restaurant.getPhoneNumber());
        existing.setOwnerId(restaurant.getOwnerId());
        existing.setIsActive(restaurant.getIsActive());
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadFile(file);
            existing.setImageUrl(imageUrl);
        }
        
        return restaurantRepository.save(existing);
    }

    @Override
    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    @Override
    public RestaurantEntity getRestaurantByOwnerId(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found for this owner"));
    }

    @Override
    public RestaurantEntity getMyRestaurant() {
        Long currentUserId = userService.findByUserId();
        return getRestaurantByOwnerId(currentUserId);
    }
}
