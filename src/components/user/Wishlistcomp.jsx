import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Nav from '../global/Nav';
import { deleteFromWishlistAsync, getWishlistAsync } from '../../redux/user/wishlist';
import { addToCartAsync } from '../../redux/user/Cart';

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist); // Corrected selector

  useEffect(() => {
    dispatch(getWishlistAsync());
  }, [dispatch]);






  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Nav />
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600">Start adding items to your wishlist!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-24 max-w-6xl mx-auto">
      <Nav />
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">YOUR WISHLIST</h2>
        <p className="mb-4">Total {wishlist.length} Items In Your Wishlist</p>
        {wishlist.map((item) => {
          const stock = item.quantity || 0; // Assuming stock information is part of productId

          return (
            <div key={item._id} className="flex items-center gap-4 border-b py-4">
              <img
                src={item.images[0]}
                alt={item.productName}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-blue-600">{item.productName}</h3>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="font-bold">₹ {item.salePrice.toLocaleString()}</p>
                {stock === 0 ? (
                  <p className="text-red-500 font-bold">Out of Stock</p>
                ) : (
                  <p className="text-green-500">In Stock</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`py-2 px-4 rounded ${
                    stock > 0
                      ? 'bg-purple-800 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  onClick={() => dispatch(addToCartAsync(item))}
                  disabled={stock === 0}
                >
                  <ShoppingCart className="inline-block mr-2" size={16} />
                  Add to Cart
                </button>
                <Trash2
                  className="text-gray-500 cursor-pointer"
                  onClick={() => dispatch(deleteFromWishlistAsync(item._id))}
                />
              </div>
            </div>
          );
        })}
      </div>
      <footer/>
    </div>
  );
};

export default WishlistPage;
