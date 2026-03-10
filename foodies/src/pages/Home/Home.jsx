import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import RestaurantList from '../../components/RestaurantList/RestaurantList';

const Home = () => {
  const [category, setCategory] = useState('All');
  return (
    <main className='container-fluid p-0'>
      <Header />
      <div className="container">
        <RestaurantList />
        <div className="mt-5 pt-4">
          <div className="d-flex align-items-center mb-2">
             <i className="bi bi-funnel text-warning fs-2 me-3"></i>
             <h2 className="m-0 fw-bold">Explore All Dishes</h2>
          </div>
          <ExploreMenu category={category} setCategory={setCategory} />
          <FoodDisplay category={category} searchText={''}/>
        </div>
      </div>
    </main>
  )
}

export default Home;