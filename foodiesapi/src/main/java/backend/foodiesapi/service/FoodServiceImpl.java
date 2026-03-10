package backend.foodiesapi.service;

import backend.foodiesapi.entity.FoodEntity;
import backend.foodiesapi.io.FoodRequest;
import backend.foodiesapi.io.FoodResponse;
import backend.foodiesapi.entity.RestaurantEntity;
import backend.foodiesapi.repository.FoodRepository;
import backend.foodiesapi.repository.RestaurantRepository;
import backend.foodiesapi.util.AuthorizationUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import backend.foodiesapi.exception.BadRequestException;
import backend.foodiesapi.exception.ResourceNotFoundException;
import backend.foodiesapi.exception.UnauthorizedException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;
    private final Cloudinary cloudinary;
    private final AuthorizationUtil authorizationUtil;
    private final RestaurantRepository restaurantRepository;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            //it is an upload file method which is used to upload the file to the cloudinary
            //getbytes convert multipartfile to bytes
            //objectutils.empty map is used to pass the empty map to the cloudinary
            if (file == null || file.isEmpty()) {
                return null;
            }
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFood = convertToEntity(request);
        
        // If it's a restaurant owner, force their restaurant ID
        if (authorizationUtil.isRestaurantOwner()) {
            Long ownerRestaurantId = authorizationUtil.getCurrentUserRestaurantId();
            if (ownerRestaurantId == null) {
                throw new UnauthorizedException("No restaurant found for this owner. Please contact admin to link your restaurant.");
            }
            newFood.setRestaurantId(ownerRestaurantId);
        } else if (request.getRestaurantId() != null) {
            newFood.setRestaurantId(request.getRestaurantId());
        } else {
            throw new BadRequestException("Restaurant ID is required to add food items.");
        }

        log.info("Adding food for restaurant ID: {}", newFood.getRestaurantId());
        String imageUrl = uploadFile(file);
        newFood.setImageUrl(imageUrl);
        newFood = foodRepository.save(newFood);
        return convertToResponse(newFood);
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request, MultipartFile file) {
        Long foodId = Long.parseLong(id);
        FoodEntity existingFood = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found for the id: " + id));

        // Authorization check
        if (!authorizationUtil.ownsRestaurant(existingFood.getRestaurantId())) {
            throw new UnauthorizedException("Unauthorized to update this food item");
        }

        // Update fields
        existingFood.setName(request.getName());
        existingFood.setDescription(request.getDescription());
        existingFood.setCategory(request.getCategory());
        existingFood.setPrice(request.getPrice());

        // Update image if provided
        if (file != null && !file.isEmpty()) {
            String imageUrl = uploadFile(file);
            existingFood.setImageUrl(imageUrl);
        }

        existingFood = foodRepository.save(existingFood);
        return convertToResponse(existingFood);
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity> databaseEntries;
        
        if (authorizationUtil.isRestaurantOwner()) {
            Long restaurantId = authorizationUtil.getCurrentUserRestaurantId();
            if (restaurantId != null) {
                databaseEntries = foodRepository.findByRestaurantId(restaurantId);
            } else {
                databaseEntries = List.of();
            }
        } else {
            databaseEntries = foodRepository.findAll();
        }
        
        return databaseEntries.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public List<FoodResponse> readFoodsByRestaurant(Long restaurantId) {
        log.info("Fetching foods for specific restaurant ID: {}", restaurantId);
        List<FoodEntity> foods = foodRepository.findByRestaurantId(restaurantId);
        log.info("Found {} foods for restaurant ID: {}", foods.size(), restaurantId);
        return foods.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
        Long foodId = Long.parseLong(id);
        FoodEntity existingFood = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found for the id: " + id));
        return convertToResponse(existingFood);
    }

    @Override
    public boolean deleteFile(String filename) {
        return true; 
    }

    @Override
    public void deleteFood(String id) {
        Long foodId = Long.parseLong(id);
        FoodEntity food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        if (!authorizationUtil.ownsRestaurant(food.getRestaurantId())) {
            throw new RuntimeException("Unauthorized to delete this food item");
        }

        foodRepository.deleteById(foodId);
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        log.debug("Converting FoodEntity ID: {} with RestaurantId: {} to response", entity.getId(), entity.getRestaurantId());
        String restaurantName = "Unknown Restaurant";
        if (entity.getRestaurantId() != null) {
            restaurantName = restaurantRepository.findById(entity.getRestaurantId())
                    .map(RestaurantEntity::getName)
                    .orElse("Unknown Restaurant");
        }

        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .restaurantId(entity.getRestaurantId())
                .restaurantName(restaurantName)
                .build();
    }
}
