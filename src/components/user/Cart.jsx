import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartAsync, getCartAsync, addQuantity } from '../../redux/user/Cart';
import { useNavigate } from 'react-router-dom';
import Nav from '../global/Nav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../global/Footer';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, cartCount, error, status } = useSelector((state) => state.cart);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  
  const handleQuantityChange = async (product_id, quantity) => {
    try {
      const result = await dispatch(addQuantity({ product_id, quantity })).unwrap();
      if (result && result.count !== undefined) {
        setErrorMessage(`Only ${result.count} left in stock.`);
        toast.warn(`Only ${result.count} left in stock.`);
      } else {
        setErrorMessage('');
        toast.success('Quantity updated successfully');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setErrorMessage('Something went wrong.');
      toast.error('Failed to update quantity');
    }
  };

  // Handle delete item
  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteCartAsync(productId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error deleting cart item:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Fetch cart data on component mount
  useEffect(() => {
    dispatch(getCartAsync());
  }, [dispatch]);

  // Calculate subtotal and total when cart changes
  useEffect(() => {
    if (cart && cart.products) {
      const calculatedSubtotal = cart.products.reduce((acc, item) => {
        if (item.productId && item.productId.salePrice) {
          return acc + item.productId.salePrice * item.quantity;
        }
        return acc;
      }, 0);

      setSubtotal(calculatedSubtotal);
      setTotal(calculatedSubtotal);

      const availableQuantities = {};
      cart.products.forEach((item) => {
        if (item.productId) {
          availableQuantities[item.productId._id] = item.productId.quantity;
        }
      });
      setAvailable(availableQuantities);
    }
  }, [cart]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Nav />
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty error</h2>
        <p className="text-gray-600">Start adding items to your cart!</p>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Nav />
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Start adding items to your cart!</p>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-col md:flex-row gap-8 p-24 max-w-6xl mx-auto">
      <Nav />
      <ToastContainer />
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">YOUR CART</h2>
        <p className="mb-4">Total {cartCount} Items In Your Cart</p>
        {cart.products.map((item) => {
          if (!item.productId) {
            return null; // Ensure we return null instead of an empty div
          }

          const stock = available[item.productId._id] || 0;

          return (
            <div key={item.productId._id} className="flex items-center gap-4 border-b py-4">
              <img
                src={item.productId.images[0]}
                alt={item.productId.productName}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-blue-600">{item.productId.productName}</h3>
                <p className="text-sm text-gray-600">Category: {item.productId.category}</p>
                <p className="font-bold">₹ {item.productId.salePrice.toLocaleString()}</p>
                {stock === 0 ? (
                  <p className="text-red-500 font-bold">Out of Stock</p>
                ) : (
                  errorMessage && <p className="text-red-500">{errorMessage}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {stock > 0 ? (
                  <select
                    className="border p-1"
                    defaultValue={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId._id, e.target.value)}
                  >
                    {[...Array(Math.min(stock, 10))].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button className="bg-gray-300 text-gray-600 cursor-not-allowed" disabled>
                    Quantity Unavailable
                  </button>
                )}
                <Trash2
                  className="text-gray-500 cursor-pointer"
                  onClick={() => handleDelete(item.productId._id)}
                />
              </div>
            </div>
          );
        })}

        <button onClick={() => navigate("/checkout")} className="bg-purple-800 text-white py-2 px-4 mt-4 w-full">
          Checkout
        </button>
      </div>

      <div className="w-full md:w-80">
        <div className="bg-gray-100 p-4">
          <h3 className="font-bold mb-2">ORDER SUMMARY</h3>
          <div className="flex justify-between mb-2">
            <span>{cart.products.length} ITEMS</span>
            <span>₹ {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>TOTAL</span>
            <span>₹ {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <Footer/>
    </div>
    </>
  );
};

export default ShoppingCart;
