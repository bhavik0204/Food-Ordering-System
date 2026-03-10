package backend.foodiesapi.service;

import com.razorpay.RazorpayException;

import java.util.Map;

public interface PaymentService {
    String createPaymentToken(Long orderId, Double amount) throws RazorpayException;
    void verifyAndSavePayment(Map<String, String> paymentData, String status);
}
