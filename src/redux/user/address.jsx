import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Thunks
export const addAddressAsync = createAsyncThunk(
  'address/addAddressAsync',
  async ({ formData }, { rejectWithValue }) => {
    try {
      console.log("ggggg")
      const response = await api.post("/user/addaddress", { data: formData }, { withCredentials: true });
      return response.data;  // Return new address
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const fetchAddressesAsync = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/getaddress', { withCredentials: true });
      return response.data; // Returning the fetched addresses
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const updateAddressAsync = createAsyncThunk(
  'address/updateAddressAsync',
  async ({ addressId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/user/updateaddress/${addressId}`, updatedData, { withCredentials: true });
      return { addressId, updatedData };  // Return updated address data to update state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const deleteAddressAsync = createAsyncThunk(
  'address/deleteAddressAsync',
  async (addressId, { rejectWithValue }) => {
    try {
      await api.delete(`/user/deleteaddress/${addressId}`, { withCredentials: true });
      return addressId;  
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const getAddressAsync = createAsyncThunk(
  'address/getAddressAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/getaddresses', { withCredentials: true });
      return response.data;  // Return list of addresses
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Slice
const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],  // Store list of addresses
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get addresses
      .addCase(getAddressAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAddressAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;  // Update state with fetched addresses
      })
      .addCase(getAddressAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add new address
      .addCase(addAddressAsync.fulfilled, (state, action) => {
        state.addresses.push(action.payload);  // Add new address to the list
        state.status = 'succeeded';  // Update status
      })
      .addCase(addAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';  // Update status
      })

      // Update address
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        const { addressId, updatedData } = action.payload;
        const existingAddress = state.addresses.find(addr => addr._id === addressId);
        if (existingAddress) {
          Object.assign(existingAddress, updatedData);  // Update the existing address with new data
        }
        state.status = 'succeeded';  // Update status
      })
      .addCase(updateAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';  // Update status
      })

      // Delete address
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        const addressId = action.payload;
        state.addresses = state.addresses.filter(addr => addr._id !== addressId);  // Remove the deleted address from state
        state.status = 'succeeded';  // Update status
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';  // Update status
      })

      // Fetch addresses
      .addCase(fetchAddressesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddressesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload; // Set the addresses from the action payload
      })
      .addCase(fetchAddressesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch addresses';
      });
  }
});


export const selectAddresses = (state) => state.address.addresses;

export default addressSlice.reducer;
