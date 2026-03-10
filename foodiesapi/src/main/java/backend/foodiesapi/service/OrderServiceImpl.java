package backend.foodiesapi.service;

import com.razorpay.RazorpayException;
import backend.foodiesapi.entity.OrderEntity;
import backend.foodiesapi.entity.OrderItemEntity;
import backend.foodiesapi.io.DashboardStats;
import backend.foodiesapi.io.OrderRequest;
import backend.foodiesapi.io.OrderResponse;
import backend.foodiesapi.repository.OrderRepository;
import backend.foodiesapi.util.AuthorizationUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import backend.foodiesapi.exception.BadRequestException;
import backend.foodiesapi.exception.ResourceNotFoundException;
import backend.foodiesapi.exception.UnauthorizedException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final UserService userService; // Injected UserService
    private final AuthorizationUtil authorizationUtil;

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException {
        // 1. Create Order Entity
        OrderEntity order = new OrderEntity();
        order.setUserId(getCurrentUserId());
        order.setUserAddress(request.getUserAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setEmail(request.getEmail());
        order.setRestaurantId(request.getRestaurantId());
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setAmount(request.getAmount());
        order.setOrderStatus("Pending");

        // Map items from request if they exist
        if (request.getOrderedItems() != null && !request.getOrderedItems().isEmpty()) {
            List<OrderItemEntity> itemEntities = request.getOrderedItems().stream().map(itemRequest -> {
                OrderItemEntity item = new OrderItemEntity();
                item.setFoodId(itemRequest.getFoodId());
                item.setFoodName(itemRequest.getName());
                item.setPrice(itemRequest.getPrice());
                item.setQuantity(itemRequest.getQuantity());
                item.setSubTotal(itemRequest.getPrice() * itemRequest.getQuantity());
                return item;
            }).collect(Collectors.toList());
            order.setOrderedItems(itemEntities);
        }

        order = orderRepository.save(order);

        // 2. Delegate payment token creation to PaymentService
        paymentService.createPaymentToken(order.getId(), request.getAmount());

        // Refresh order to get the updated embedded payment details
        order = orderRepository.findById(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found after payment initialization"));

        // 3. Return Order Response
        return OrderResponse.fromEntity(order);
    }

    @Override
    public void verifyPayment(Map<String, String> paymentData, String status) {
        // Delegate verification and saving to PaymentService (which updates OrderEntity)
        paymentService.verifyAndSavePayment(paymentData, status);

        // Optionally update order status based on payment success
        if ("Paid".equalsIgnoreCase(status) || "Success".equalsIgnoreCase(status)) {
            String razorpayOrderId = paymentData.get("razorpay_order_id");
            OrderEntity order = orderRepository.findByPaymentGatewayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found for status update"));
            order.setOrderStatus("Confirmed");
            orderRepository.save(order);
        }
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        Long currentUserId = getCurrentUserId();
        List<OrderEntity> userOrders = orderRepository.findByUserId(currentUserId);

        return userOrders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        OrderEntity order = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        orderRepository.delete(order);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        // Admin or authorized role should be able to access all orders
        List<OrderEntity> allOrders;
        
        if (authorizationUtil.isRestaurantOwner()) {
            Long restaurantId = authorizationUtil.getCurrentUserRestaurantId();
            allOrders = orderRepository.findByRestaurantId(restaurantId);
        } else {
            allOrders = orderRepository.findAll();
        }
        
        return allOrders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        // Only admins can change the order status
        OrderEntity order = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!authorizationUtil.ownsRestaurant(order.getRestaurantId())) {
            throw new UnauthorizedException("Unauthorized to update this order status");
        }

        // Validate that the status is acceptable (e.g., "Pending", "Shipped",
        // "Delivered")
        if (!isValidOrderStatus(status)) {
            throw new BadRequestException("Invalid order status");
        }

        order.setOrderStatus(status);
        orderRepository.save(order);
    }

    @Override
    public DashboardStats getDashboardStats() {
        List<OrderEntity> allOrders;
        
        if (authorizationUtil.isRestaurantOwner()) {
            Long restaurantId = authorizationUtil.getCurrentUserRestaurantId();
            allOrders = orderRepository.findByRestaurantId(restaurantId);
        } else {
            allOrders = orderRepository.findAll();
        }
        
        int totalOrders = allOrders.size();
        double totalRevenue = allOrders.stream()
                .mapToDouble(OrderEntity::getAmount)
                .sum();
        double averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;
        
        return DashboardStats.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .averageOrderValue(averageOrderValue)
                .build();
    }

    private boolean isValidOrderStatus(String status) {
        return List.of("Pending", "Food Preparing", "Out for delivery", "Delivered", "Cancelled").contains(status);
    }

    private Long getCurrentUserId() {
        return userService.findByUserId(); // Use UserService to get ID safely
    }
}
