// redux/user/WishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

// Thunk for fetching the wishlist
export const getWishlistAsync = createAsyncThunk(
  'wishlist/getWishlist',
  async () => {
    const response = await api.get('/user/getwishlist',{withCredentials:true}); // Update with your API endpoint
    console.log(response.data.wishlist)
    return response.data.wishlist;
  }
);

// Thunk for adding an item to the wishlist
export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product) => {
    const response = await api.post(`/user/addtowishlist${product.productId}`,); 
   
     console.log('dding')
    return response.data;
  }
);

// Thunk for removing an item from the wishlist
export const deleteFromWishlistAsync = createAsyncThunk(
  'wishlist/deleteFromWishlist',
  async (productId) => {
    await api.delete(`/user/deletewishlist/${productId}`,{withCredentials:true}); // Update with your API endpoint
   console.log(productId)
    return productId; // Return the product ID for removal from the state
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        console.log("kkkk")
        console.log(state.wishlist)
        state.error = null;
      })
      .addCase(getWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.wishlist.push(action.payload);
        state.error = null;
      })
      .addCase(deleteFromWishlistAsync.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload // Update this based on your ID field
        );
      });
  },
});

export const selectWishlist = (state) => state.wishlist.wishlist;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
