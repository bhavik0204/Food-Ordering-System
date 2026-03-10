package backend.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private double price;
    private String imageUrl;
    private Long restaurantId;
    private String restaurantName;
}
