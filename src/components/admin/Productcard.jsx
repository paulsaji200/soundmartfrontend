import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, selectProducts, selectLoading } from '../../redux/user/getProduct';
import { getCartAsync, addToCartAsync } from '../../redux/user/Cart';
import api from '../../utils/axios';
import { Heart } from 'lucide-react';

const Productcomp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState({});
  const [inWishlist, setInWishlist] = useState({});
  const itemsPerPage = 20;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
  

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    dispatch(addToCartAsync(product));
    setAddedToCart((prevState) => ({ ...prevState, [product._id]: true }));
  };

  const handleCardClick = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const goToCart = (event) => {
    event.stopPropagation();
    navigate('/cart');
  };

  const toggleWishlist = async (event, productId) => {
    event.stopPropagation();

    try {
      await api.post(`/user/addtowishlist/${productId}`, {}, { withCredentials: true });
      setInWishlist((prevState) => ({
        ...prevState,
        [productId]: !prevState[productId],
      }));
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getCartAsync());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center">
      {/* Product Cards */}
      <div className="flex flex-wrap gap-4 justify-center">
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(currentProducts) && currentProducts.length > 0 ? (
          currentProducts.map((productItem) => (
            <div
              key={productItem._id}
              className="w-64 h-auto rounded overflow-hidden shadow-lg bg-white p-4 flex flex-col mb-12 relative"
              onClick={() => handleCardClick(productItem._id)}
            >
              {/* Wishlist */}
              <button
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white shadow-md"
                onClick={(e) => toggleWishlist(e, productItem._id)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    inWishlist[productItem._id] ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                />
              </button>

              <img
                className="w-full h-60 object-cover"
                src={productItem.images[0] || 'https://via.placeholder.com/150'}
                alt={productItem.name || 'Product Image'}
              />

              {/* Product Details */}
              <div className="flex-grow px-2 py-1">
  <div className="font-bold text-lg mb-1 truncate">{productItem.productName || 'Product Name'}</div>
  <p className="text-gray-700 text-sm line-clamp-2">{productItem.description || 'Product description.'}</p>
  <div className="mt-2 flex items-center">
    <span className="text-gray-900 font-bold text-base">₹{productItem.salePrice || '0.00'}</span>
    
   
    {productItem.salePrice && productItem.productPrice && productItem.salePrice < productItem.productPrice && (
      <span className="text-red-500 text-xs ml-2 line-through">₹{productItem.productPrice}</span>
    )}
  </div>


                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-block ${
                      productItem.quantity > 0 ? 'bg-green-200' : 'bg-red-200'
                    } rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2`}
                  >
                    {productItem.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="inline-block bg-yellow-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                    {productItem.rating ? `${productItem.rating} ★` : '4.0 ★'}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="px-2 py-2">
                {addedToCart[productItem._id] ? (
                  <button
                    className="bg-green-500 text-white font-bold py-1 px-2 rounded hover:bg-green-700 w-full text-sm"
                    onClick={goToCart}
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    className={`bg-blue-500 text-white font-bold py-1 px-2 rounded hover:bg-blue-700 w-full text-sm ${
                      productItem.quantity === 0 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={productItem.quantity === 0}
                    onClick={(event) => handleAddToCart(event, productItem)}
                  >
                    {productItem.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>

      
      <div className="flex items-center justify-center mt-8 mb-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 hover:bg-gray-400'
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Productcomp;
