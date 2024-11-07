import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';


export const getOrdersasync = createAsyncThunk(
  'orders/getOrdersasync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/getorder', { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  }
);


export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, productId }, { rejectWithValue }) => {
    console.log("vvvvvvv")
    console.log( orderId, productId)
    try {
      const response = await api.patch(
        '/user/cancelOrder', 
        { orderId, productId }, 
        { withCredentials: true }
      );
      return { orderId, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error canceling order');
    }
  }
);
export const returnOrder = createAsyncThunk(
  'orders/returnOrder',
  async ({ orderId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        '/user/returnOrder', 
        { orderId, productId }, 
        { withCredentials: true }
      );
      console.log(response);  
      return { orderId, productId };

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error canceling order');
    }
  }
);
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders Cases
      .addCase(getOrdersasync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrdersasync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(getOrdersasync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Cancel Order Case
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const { orderId, productId } = action.payload;
        const order = state.orders.find((order) => order._id === orderId);
        if (order) {
          const product = order.products.find((p) => p._id === productId);
          if (product) {
            product.status = 'Cancelled'; // Update product status to 'Cancelled'
          }
        }
      }).addCase(returnOrder.fulfilled, (state, action) => {
        const { orderId, productId } = action.payload;
        const order = state.orders.find((order) => order._id === orderId);
        if (order) {
          const product = order.products.find((p) => p._id === productId);
          if (product) {
            product.status = 'Returned'; // Update product status to 'Cancelled'
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectOrders = (state) => state.orders.orders;


export default ordersSlice.reducer;
