package backend.foodiesapi.service;

import org.springframework.web.multipart.MultipartFile;

import backend.foodiesapi.io.FoodRequest;
import backend.foodiesapi.io.FoodResponse;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    FoodResponse updateFood(String id, FoodRequest request, MultipartFile file);

    List<FoodResponse> readFoods();

    List<FoodResponse> readFoodsByRestaurant(Long restaurantId);

    FoodResponse readFood(String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);
}
