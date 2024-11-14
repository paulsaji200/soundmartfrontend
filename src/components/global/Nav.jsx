import { useState, useEffect } from 'react';
import { FaSearch, FaRegUser } from 'react-icons/fa';
import { GrFavorite } from 'react-icons/gr';
import { IoCartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { fetchProducts } from '../../redux/user/getProduct';
import { useDispatch, useSelector } from 'react-redux';
import { getCartAsync } from '../../redux/user/Cart';

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useSelector((state) => state.cart.cart);
  const cartItemsCount = cart?.products?.length || 0;

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(fetchProducts({ queryString: '' })); // Fetch all products on clearing the search
  };

  useEffect(() => {
    dispatch(getCartAsync()); 
  }, [dispatch]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      handleClearSearch();
      navigate('/');
    } else {
      dispatch(fetchProducts({ queryString: `query=${searchQuery}` }));
      navigate('/');
    }
  };

  return (
    <header className="h-16 shadow-md fixed top-0 left-0 w-full bg-gray-100 z-50">
      <div className="h-full container mx-auto flex items-center px-4 sm:px-6 lg:px-20 justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-black cursor-pointer" onClick={() => navigate('/')}>
            Sound Mart
          </div>
        </div>

        <form
          className="hidden sm:flex items-center justify-center w-full max-w-3xl pl-2 border rounded-full border-gray-300 bg-white"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            placeholder="Search products here"
            className="w-full outline-none px-4 py-2"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {searchQuery && (
            <button type="button" onClick={handleClearSearch} className="text-gray-500 text-sm px-2">
              Clear
            </button>
          )}
          <button type="submit" className="text-lg w-10 bg-black h-8 flex items-center justify-center rounded-r-full text-white">
            <FaSearch />
          </button>
        </form>

        <div className="block sm:hidden text-2xl text-black cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <AiOutlineMenu />
        </div>

        <div className="hidden sm:flex items-center gap-10">
          <div onClick={() => navigate("/wishlist")} className="cursor-pointer text-black h-8 w-8 flex items-center justify-center text-xl">
            <GrFavorite />
          </div>

          <div className="flex items-center justify-center relative">
            <span onClick={() => navigate("/cart")} className="h-8 w-8 flex items-center justify-center cursor-pointer text-black text-xl">
              <IoCartOutline />
            </span>
            {cartItemsCount > 0 && (
              <p className="text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs absolute top-0 -right-2">
                {cartItemsCount}
              </p>
            )}
          </div>

          <div className="h-8 flex items-center justify-center relative">
            <p
              onClick={() => navigate("/userprofile")}
              className="text-white h-full px-3 flex items-center justify-center cursor-pointer bg-black text-sm rounded-full"
            >
              <FaRegUser />
            </p>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-gray-100 shadow-lg z-40 sm:hidden">
          <div className="flex flex-col items-center py-4">
            <div className="py-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center w-3/4">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full outline-none px-4 py-2 border rounded-full border-gray-300"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                {searchQuery && (
                  <button type="button" onClick={handleClearSearch} className="text-gray-500 text-sm px-2">
                    Clear
                  </button>
                )}
                <button type="submit" className="ml-2 text-lg">
                  <FaSearch />
                </button>
              </form>
            </div>
            <div className="py-2" onClick={() => navigate('/favorites')}>
              <GrFavorite className="text-2xl text-black" />
              <p className="text-black text-sm">Favorites</p>
            </div>
            <div className="py-2" onClick={() => navigate('/cart')}>
              <IoCartOutline className="text-2xl text-black" />
              <p className="text-black text-sm">Cart</p>
            </div>
            <div className="py-2" onClick={() => navigate('/login')}>
              <FaRegUser className="text-2xl text-black" />
              <p className="text-black text-sm">Login</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
