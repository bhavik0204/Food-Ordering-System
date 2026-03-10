package backend.foodiesapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEntity {

    @Column(name = "razorpay_payment_id")
    private String transactionId; // Razorpay Payment ID

    @Column(name = "razorpay_order_id")
    private String gatewayOrderId; // Razorpay Order ID

    @Column(name = "razorpay_signature")
    private String signature; // Razorpay Signature

    @Column(name = "payment_method")
    private String method; // UPI, Card, etc.

    @Column(name = "payment_amount")
    private Double amount;

    @Column(name = "payment_status")
    private String status; // Pending, Success, Failed

    @Builder.Default
    @Column(name = "payment_created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
