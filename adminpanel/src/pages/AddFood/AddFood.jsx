import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodService';
import { fetchAllRestaurants } from '../../services/restaurantService';
import { toast } from 'react-toastify';

const AddFood = () => {
    const [image, setImage] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Biryani',
        restaurantId: ''
    });

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                const res = await fetchAllRestaurants();
                setRestaurants(res);
            } catch (error) {
                toast.error("Error loading restaurants list");
            }
        };
        loadRestaurants();
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!image) {
            toast.error('Please select an image.');
            return;
        }
        if (!data.restaurantId) {
            toast.error('Please select a restaurant.');
            return;
        }

        try {
            await addFood(data, image);
            toast.success('Food added successfully.');
            setData({ 
                name: '', 
                description: '', 
                category: 'Biryani', 
                price: '', 
                restaurantId: data.restaurantId // Keep the restaurant selected
            });
            setImage(null);
        } catch (error) {
            toast.error('Error adding food. Make sure all fields are valid.');
        }
    }

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-6 shadow-sm border-0">
                    <div className="card-body p-4">
                        <h2 className="mb-4 fw-bold">Add New Food Item</h2>
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-4 text-center">
                                <label htmlFor="image" className="form-label d-block mb-3">
                                    <div className="bg-light border rounded-4 d-flex align-items-center justify-content-center mx-auto" style={{width: '120px', height: '120px', cursor: 'pointer', overflow: 'hidden'}}>
                                        {image ? <img src={URL.createObjectURL(image)} alt="" className="img-fluid" /> : 
                                         <i className="bi bi-cloud-arrow-up fs-1 text-muted"></i>}
                                    </div>
                                    <p className="mt-2 small text-muted">Upload Dish Image</p>
                                </label>
                                <input type="file" className="form-control" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                            </div>

                            <div className="row g-3">
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold">Select Restaurant</label>
                                    <select name="restaurantId" className="form-select" required onChange={onChangeHandler} value={data.restaurantId}>
                                        <option value="">-- Choose Restaurant --</option>
                                        {restaurants.map(res => (
                                            <option key={res.id} value={res.id}>{res.name} (ID: {res.id})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Name</label>
                                    <input type="text" placeholder='Dish name' className="form-control" id="name" required name='name' onChange={onChangeHandler} value={data.name} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="price" className="form-label fw-bold">Price (₹)</label>
                                    <input type="number" name="price" id="price" placeholder='200' className='form-control' onChange={onChangeHandler} value={data.price} required />
                                </div>

                                <div className="col-12 mb-3">
                                    <label htmlFor="category" className="form-label fw-bold">Category</label>
                                    <select name="category" id="category" className='form-select' onChange={onChangeHandler} value={data.category}>
                                        <option value="Biryani">Biryani</option>
                                        <option value="Cake">Cake</option>
                                        <option value="Burger">Buger</option>
                                        <option value="Pizza">Pizza</option>
                                        <option value="Rolls">Rolls</option>
                                        <option value="Salad">Salad</option>
                                        <option value="Ice cream">Ice cream</option>
                                    </select>
                                </div>

                                <div className="col-12 mb-4">
                                    <label htmlFor="description" className="form-label fw-bold">Description</label>
                                    <textarea className="form-control" placeholder='Short description of the dish...' id="description" rows="3" required name='description' onChange={onChangeHandler} value={data.description}></textarea>
                                </div>
                            </div>
                            
                            <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold">
                                <i className="bi bi-plus-lg me-2"></i> Add Item
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddFood;