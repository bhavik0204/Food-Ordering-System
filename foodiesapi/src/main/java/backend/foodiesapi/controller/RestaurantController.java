package backend.foodiesapi.controller;

import backend.foodiesapi.entity.RestaurantEntity;
import backend.foodiesapi.service.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping(consumes = {"multipart/form-data"})
    public RestaurantEntity createRestaurant(
            @RequestPart("restaurant") RestaurantEntity restaurant,
            @RequestPart(value = "image", required = false) MultipartFile file) {
        return restaurantService.createRestaurant(restaurant, file);
    }

    @GetMapping
    public List<RestaurantEntity> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public RestaurantEntity getRestaurantById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public RestaurantEntity updateRestaurant(
            @PathVariable Long id,
            @RequestPart("restaurant") RestaurantEntity restaurant,
            @RequestPart(value = "image", required = false) MultipartFile file) {
        return restaurantService.updateRestaurant(id, restaurant, file);
    }

    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
    }

    @GetMapping("/my-restaurant")
    public RestaurantEntity getMyRestaurant() {
        return restaurantService.getMyRestaurant();
    }
}
