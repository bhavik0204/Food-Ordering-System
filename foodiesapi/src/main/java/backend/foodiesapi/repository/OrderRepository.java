package backend.foodiesapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.foodiesapi.entity.OrderEntity;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserId(Long userId);

    List<OrderEntity> findByRestaurantId(Long restaurantId);

    Optional<OrderEntity> findByPaymentGatewayOrderId(String gatewayOrderId);
}
