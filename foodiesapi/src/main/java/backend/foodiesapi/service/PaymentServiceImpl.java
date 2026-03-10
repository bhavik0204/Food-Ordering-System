package backend.foodiesapi.service;

import backend.foodiesapi.entity.PaymentEntity;
import backend.foodiesapi.entity.OrderEntity;
import backend.foodiesapi.exception.BadRequestException;
import backend.foodiesapi.exception.ResourceNotFoundException;
import backend.foodiesapi.repository.OrderRepository;
import backend.foodiesapi.util.RazorpayUtil;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final RazorpayUtil razorpayUtil;

    @Override
    public String createPaymentToken(Long orderId, Double amount) throws RazorpayException {
        String razorpayOrderId = razorpayUtil.createRazorpayOrder(amount);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        PaymentEntity payment = PaymentEntity.builder()
                .gatewayOrderId(razorpayOrderId)
                .amount(amount)
                .status("Pending")
                .build();

        order.setPayment(payment);
        orderRepository.save(order);

        return razorpayOrderId;
    }

    @Override
    public void verifyAndSavePayment(Map<String, String> paymentData, String status) {
        String razorpayOrderId = paymentData.get("razorpay_order_id");
        String razorpayPaymentId = paymentData.get("razorpay_payment_id");
        String razorpaySignature = paymentData.get("razorpay_signature");

        if (!razorpayUtil.verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
            throw new BadRequestException("Payment verification failed.");
        }

        OrderEntity order = orderRepository.findByPaymentGatewayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for Gateway Order ID"));

        PaymentEntity payment = order.getPayment();
        if (payment == null) {
            payment = new PaymentEntity();
            payment.setGatewayOrderId(razorpayOrderId);
        }

        payment.setStatus(status);
        payment.setTransactionId(razorpayPaymentId);
        payment.setSignature(razorpaySignature);
        
        order.setPayment(payment); // Update embedded payment
        orderRepository.save(order);
    }
}
