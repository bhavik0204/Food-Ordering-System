package backend.foodiesapi.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.foodiesapi.entity.FoodEntity;
import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<FoodEntity, Long> {
    List<FoodEntity> findByRestaurantId(Long restaurantId);
}
