package backend.foodiesapi.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.foodiesapi.entity.CartEntity;

import java.util.Optional;

@Repository
public interface CartRespository extends JpaRepository<CartEntity, Long> {

    // Find cart by userId
    Optional<CartEntity> findByUserId(Long userId);

    // Delete cart by userId
    void deleteByUserId(Long userId);
}
