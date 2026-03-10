package backend.foodiesapi.service;

import backend.foodiesapi.io.UserRequest;
import backend.foodiesapi.io.UserResponse;
import java.util.List;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    Long findByUserId();
    List<UserResponse> getAllUsers();
}
