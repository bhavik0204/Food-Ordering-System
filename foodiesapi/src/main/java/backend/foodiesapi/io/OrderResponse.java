package backend.foodiesapi.io;

import backend.foodiesapi.entity.OrderEntity;
import backend.foodiesapi.entity.OrderItemEntity;
import backend.foodiesapi.entity.PaymentEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String paymentStatus;
    private String razorpayOrderId;
    private String orderStatus;
    private List<OrderItemEntity> orderedItems;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long restaurantId;
    private String specialInstructions;

    public static OrderResponse fromEntity(OrderEntity order) {
        PaymentEntity payment = order.getPayment();
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userAddress(order.getUserAddress())
                .phoneNumber(order.getPhoneNumber())
                .email(order.getEmail())
                .orderedItems(order.getOrderedItems())
                .amount(order.getAmount())
                .paymentStatus(payment != null ? payment.getStatus() : "N/A")
                .orderStatus(order.getOrderStatus())
                .razorpayOrderId(payment != null ? payment.getGatewayOrderId() : null)
                .razorpayPaymentId(payment != null ? payment.getTransactionId() : null)
                .razorpaySignature(payment != null ? payment.getSignature() : null)
                .restaurantId(order.getRestaurantId())
                .specialInstructions(order.getSpecialInstructions())
                .build();
    }
}
