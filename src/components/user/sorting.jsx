import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFilteredProducts } from '../../redux/user/getProduct';

const SidebarFilter = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    price: null,
    category: [],
    brand: [],
    rating: null,
    newArrivals: false,
    popularity: false,
    featured: false,
  });

  const priceRanges = [
    { label: '$500 - $1499', min: 500, max: 1499 },
    { label: '$1500 - $2999', min: 1500, max: 2999 },
    { label: '$3000 - $4999', min: 3000, max: 4999 },
    { label: '$5000+', min: 5000, max: Infinity },
  ];

  const categories = [, 'headphones', 'earbuds', 'speaker'];
  const brands = ['boat', 'Oppo', 'JBL', 'OnePlus'];
  const ratings = [1, 2, 3, 4, 5];

  const handleCheckboxChange = (type, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = prevFilters[type].includes(value)
        ? prevFilters[type].filter((item) => item !== value)
        : [...prevFilters[type], value];

      return { ...prevFilters, [type]: updatedFilters };
    });
  };

  const handleSingleOptionChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handlePriceChange = (range) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      price: prevFilters.price && prevFilters.price.min === range.min && prevFilters.price.max === range.max ? null : range,
    }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      price: null,
      category: [],
      brand: [],
      rating: null,
      newArrivals: false,
      popularity: false,
      featured: false,
    };

    setFilters(defaultFilters);
    
    // Dispatch the reset filters
    dispatch(fetchFilteredProducts(defaultFilters));
  };

  useEffect(() => {
    const formattedFilters = {
      ...filters,
      price: filters.price ? JSON.stringify(filters.price) : null,
      category: filters.category.length > 0 ? filters.category : null,
      brand: filters.brand.length > 0 ? filters.brand : null,
    };

    console.log('Dispatching filters:', formattedFilters);
    dispatch(fetchFilteredProducts(formattedFilters));
  }, [filters, dispatch]);

  return (
    <div className="bg-white  p-4bg-white shadow-lg rounded-lg p-4 h-[90vh] overflow-y-auto sticky top-0">
      <h2 className="text-2xl font-bold mb-4">Filters</h2>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Price</h3>
        {priceRanges.map((range) => (
          <div key={range.label} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={range.label}
              checked={filters.price && filters.price.min === range.min && filters.price.max === range.max}
              onChange={() => handlePriceChange(range)}
              className="mr-2"
            />
            <label htmlFor={range.label}>{range.label}</label>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Category</h3>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={category}
              checked={filters.category.includes(category)}
              onChange={() => handleCheckboxChange('category', category)}
              className="mr-2"
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Brand</h3>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={brand}
              checked={filters.brand.includes(brand)}
              onChange={() => handleCheckboxChange('brand', brand)}
              className="mr-2"
            />
            <label htmlFor={brand}>{brand}</label>
          </div>
        ))}
      </div>

      {/* Ratings Filter */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Average Rating</h3>
        {ratings.map((rating) => (
          <div key={rating} className="flex items-center mb-1">
            <input
              type="radio"
              id={`rating-${rating}`}
              checked={filters.rating === rating}
              onChange={() => handleSingleOptionChange('rating', rating)}
              className="mr-2"
            />
            <label htmlFor={`rating-${rating}`} className="flex items-center">
              {Array.from({ length: rating }, (_, index) => (
                <span key={index} className="text-yellow-400">★</span>
              ))}
              & up
            </label>
          </div>
        ))}
      </div>

      {/* Other Filters */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Other Filters</h3>
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="newArrivals"
            checked={filters.newArrivals}
            onChange={() => handleSingleOptionChange('newArrivals', !filters.newArrivals)}
            className="mr-2"
          />
          <label htmlFor="newArrivals">New Arrivals</label>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="popularity"
            checked={filters.popularity}
            onChange={() => handleSingleOptionChange('popularity', !filters.popularity)}
            className="mr-2"
          />
          <label htmlFor="popularity">Most Popular</label>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="featured"
            checked={filters.featured}
            onChange={() => handleSingleOptionChange('featured', !filters.featured)}
            className="mr-2"
          />
          <label htmlFor="featured">Featured</label>
        </div>
      </div>

      {/* Reset Filters Button */}
      <button 
        onClick={resetFilters} 
        className="mt-4 bg-red-500 text-white rounded py-2 px-4 hover:bg-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SidebarFilter;
