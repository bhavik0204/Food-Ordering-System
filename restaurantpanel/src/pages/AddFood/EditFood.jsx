import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readFood, updateFood } from '../../services/foodService';
import { toast } from 'react-toastify';

const EditFood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Biryani'
    });

    useEffect(() => {
        const fetchFoodData = async () => {
            try {
                const food = await readFood(id);
                setData({
                    name: food.name,
                    description: food.description,
                    price: food.price,
                    category: food.category
                });
                setCurrentImageUrl(food.imageUrl);
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching food details.');
                navigate('/list');
            }
        };
        fetchFoodData();
    }, [id, navigate]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await updateFood(id, data, image);
            toast.success('Food updated successfully.');
            navigate('/list');
        } catch (error) {
            toast.error('Error updating food.');
        }
    }

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="mx-2 mt-2">
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <h2 className="mb-4">Edit Food Item</h2>
                    <form onSubmit={onSubmitHandler}>
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <label htmlFor="image" className="form-label border rounded d-flex align-items-center justify-content-center bg-light" style={{ height: '200px', cursor: 'pointer' }}>
                                    {image ? <img src={URL.createObjectURL(image)} alt="" className="img-fluid" style={{ maxHeight: '190px' }} /> :
                                        currentImageUrl ? <img src={currentImageUrl} alt="" className="img-fluid" style={{ maxHeight: '190px' }} /> :
                                            <div className="text-center"><i className="bi bi-cloud-arrow-up fs-1"></i><p>Upload New Image (Optional)</p></div>}
                                </label>
                                <input type="file" className="form-control" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                                <small className="text-muted d-block text-center">Click to change image</small>
                            </div>
                            <div className="col-md-8">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Food Name</label>
                                    <input type="text" className="form-control" id="name" required name='name' onChange={onChangeHandler} value={data.name} />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <select name="category" id="category" className='form-select' onChange={onChangeHandler} value={data.category}>
                                            <option value="Biryani">Biryani</option>
                                            <option value="Cake">Cake</option>
                                            <option value="Burger">Burger</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Rolls">Rolls</option>
                                            <option value="Salad">Salad</option>
                                            <option value="Ice cream">Ice cream</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="price" className="form-label">Price (₹)</label>
                                        <input type="number" name="price" id="price" className='form-control' onChange={onChangeHandler} value={data.price} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" rows="3" required name='description' onChange={onChangeHandler} value={data.description}></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary px-4">Update Food</button>
                                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/list')}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditFood;
