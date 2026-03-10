import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteFood, getFoodList } from "../../services/foodService";
import { useNavigate } from "react-router-dom";

const ListFood = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error("Error while reading the foods.");
    }
  };

  const removeFood = async (foodId) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food removed.");
        await fetchList();
      }
    } catch (error) {
      toast.error("Error occurred while removing the food.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="card shadow-sm border-0 mt-2">
      <div className="card-body p-4">
        <h2 className="mb-4">Menu Items</h2>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? <tr><td colSpan="5" className="text-center py-4">No items found in your restaurant.</td></tr> : 
                list.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img src={item.imageUrl} alt="" className="rounded shadow-sm" height={60} width={60} style={{objectFit: 'cover'}} />
                  </td>
                  <td className="fw-bold">{item.name}</td>
                  <td><span className="badge bg-light text-dark border">{item.category}</span></td>
                  <td>₹{item.price}.00</td>
                  <td className="text-center">
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => navigate(`/edit/${item.id}`)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeFood(item.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListFood;
