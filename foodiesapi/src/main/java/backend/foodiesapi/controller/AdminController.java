package backend.foodiesapi.controller;

import backend.foodiesapi.entity.RestaurantEntity;
import backend.foodiesapi.io.UserResponse;
import backend.foodiesapi.service.RestaurantService;
import backend.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final RestaurantService restaurantService;
    private final UserService userService;

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/restaurants")
    public List<RestaurantEntity> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @PostMapping(value = "/restaurants", consumes = {"multipart/form-data"})
    public RestaurantEntity createRestaurant(
            @RequestPart("restaurant") RestaurantEntity restaurant,
            @RequestPart(value = "image", required = false) MultipartFile file) {
        return restaurantService.createRestaurant(restaurant, file);
    }

    @PutMapping(value = "/restaurants/{id}", consumes = {"multipart/form-data"})
    public RestaurantEntity updateRestaurant(
            @PathVariable Long id,
            @RequestPart("restaurant") RestaurantEntity restaurant,
            @RequestPart(value = "image", required = false) MultipartFile file) {
        return restaurantService.updateRestaurant(id, restaurant, file);
    }

    @DeleteMapping("/restaurants/{id}")
    public void deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
    }
}
