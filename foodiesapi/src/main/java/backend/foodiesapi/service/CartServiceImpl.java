package backend.foodiesapi.service;

import backend.foodiesapi.entity.CartEntity;
import backend.foodiesapi.entity.CartItemEntity;
import backend.foodiesapi.io.CartRequest;
import backend.foodiesapi.io.CartResponse;
import backend.foodiesapi.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserService userService;

    @Override
    @Transactional
    public CartResponse addToCart(CartRequest request) {
        Long loggedInUserId = userService.findByUserId();

        CartEntity cart = cartRepository.findByUserId(loggedInUserId)
                .orElseGet(() -> CartEntity.builder().userId(loggedInUserId).items(new ArrayList<>()).build());

        List<CartItemEntity> items = cart.getItems();
        if (items == null)
            items = new ArrayList<>();

        // Check if item already exists
        CartItemEntity existingItem = items.stream()
                .filter(i -> i.getItemId().equals(request.getFoodId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + 1);
        } else {
            CartItemEntity newItem = CartItemEntity.builder()
                    .itemId(request.getFoodId())
                    .quantity(1)
                    .build();
            items.add(newItem);
        }

        cart.setItems(items);
        cart = cartRepository.save(cart);

        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        Long loggedInUserId = userService.findByUserId();

        CartEntity cart = cartRepository.findByUserId(loggedInUserId)
                .orElse(CartEntity.builder().userId(loggedInUserId).items(new ArrayList<>()).build());

        return convertToResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart() {
        Long loggedInUserId = userService.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(CartRequest cartRequest) {
        Long loggedInUserId = userService.findByUserId();

        CartEntity cart = cartRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItemEntity> items = cart.getItems();

        CartItemEntity existingItem = items.stream()
                .filter(i -> i.getItemId().equals(cartRequest.getFoodId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int qty = existingItem.getQuantity();
            if (qty > 1) {
                existingItem.setQuantity(qty - 1);
            } else {
                items.remove(existingItem);
            }
            cart.setItems(items);
            cart = cartRepository.save(cart);
        }

        return convertToResponse(cart);
    }

    private CartResponse convertToResponse(CartEntity cart) {
        // Convert List<CartItemEntity> to Map<String, Integer> for frontend
        // compatibility
        var itemsMap = (cart.getItems() != null) ? cart.getItems().stream()
                .collect(Collectors.toMap(CartItemEntity::getItemId, CartItemEntity::getQuantity))
                : new java.util.HashMap<String, Integer>();

        return CartResponse.builder()
                .id(String.valueOf(cart.getId()))
                .userId(String.valueOf(cart.getUserId()))
                .items(itemsMap)
                .build();
    }
}
