import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Thunk for adding an item to the cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (product, { rejectWithValue }) => {
    try {
      console.log("adding")
      const response = await api.post('/user/addtocart', { productData: product }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Thunk for adding quantity of an item in the cart
export const addQuantity = createAsyncThunk(
  'cart/addQuantity',
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/cartupdate/${product_id}`, { quantity }, { withCredentials: true });
      return { product_id, quantity }; // Return product_id and quantity to update the state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Thunk for deleting an item from the cart
export const deleteCartAsync = createAsyncThunk(
  'cart/deleteCartAsync',
  async (product_id, { rejectWithValue }) => {
    try {
      await api.delete(`/user/deletecart/${product_id}`, { withCredentials: true });
      return product_id; // Return product_id to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Thunk for fetching the cart data
export const getCartAsync = createAsyncThunk(
  'cart/getCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/getcart', { withCredentials: true });
      console.log("hitted,,,,,,")
     
      return response.data;
      
    } catch (error) {
      console.log(error,"js cvsdjv")
      return rejectWithValue(error.response?.data || 'Something went wrong,dvcgsdvcshdgvc');
    }
  }
);

// Thunk for clearing the cart
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/user/clearcart', { withCredentials: true }); // Update with your API endpoint
      return []; // No need to return anything, just clear the cart state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Cart slice definition
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { products: [] }, // Initialize cart with an empty products array
    cartCount: 0, // New state for cart item count
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.cart = action.payload || { products: [] }; // Ensure cart is not undefined
        state.cartCount = state.cart.products?.reduce((acc, item) => acc + item.quantity, 0) || 0; // Update cart count
      })
      
      .addCase(getCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
   
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const existingProduct = state.cart.products.find(
            (product) => product.productId._id === action.payload.productId._id
        );
    
        if (existingProduct) {
        
            existingProduct.quantity += 1;
        } else {
          
            state.cart.products.push(action.payload);
        }
    
        
        state.cartCount = state.cart.products.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
    })
    
      .addCase(addToCartAsync.rejected, (state, action) => {
        console.log("rejjjjjj")
        state.error = action.payload;
      })
      // Add Quantity
      .addCase(addQuantity.fulfilled, (state, action) => {
        const { product_id, quantity } = action.payload;
        const product = state.cart?.products?.find(product => product.productId._id === product_id);
        if (product) {
          product.quantity = quantity;
        }
        state.cartCount = state.cart.products.reduce((acc, item) => acc + item.quantity, 0); // Update cart count
      })
      .addCase(addQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Cart Item
      .addCase(deleteCartAsync.fulfilled, (state, action) => {
        const productId = action.payload;
        state.cart.products = state.cart.products.filter(product => product.productId._id !== productId);
        state.cartCount = state.cart.products.reduce((acc, item) => acc + item.quantity, 0); // Update cart count
      })
      .addCase(deleteCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cart.products = [];
        console.log('clearing')
        console.log(state.cart.products) // Clear the products array
        state.cartCount = 0; // Reset cart count
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
