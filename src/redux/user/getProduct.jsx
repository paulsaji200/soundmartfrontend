import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Define the initial state
const initialState = {
  products: [], // Holds the list of products
  loading: false, // Loading status
  error: null, // Error message
};

// Thunk to fetch all products initially
// Redux Action
export const fetchAllProducts = createAsyncThunk('products/fetchAll', async ({ search, filters }) => {
  
  console.log(search,filters)
  const response = await api.get('/user/getproduct', {
    params: { search, ...filters }, // Send search and filters as query parameters
  });
  return response.data.data; // Ensure this is what you want to return
});


// Thunk to fetch products based on search or filters
export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ queryString }) => {
  console.log(queryString);
  const response = await api.get(`/user/search?${queryString}`);

  console.log(response, "hdbchjsdbcjhbchje");
  return response.data.data;
});

export const fetchFilteredProducts = createAsyncThunk(
  'products/fetchFiltered',
  async (filters) => {
    console.log(filters)
    const response = await api.get('/user/filter', { params: filters });
    console.log(response.data.data.products);
    return response.data.data.products; 
  }
);
// Create the product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Update products with the fetched data
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error if fetching fails
      })

      // Handle search and filtered products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous error
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
  
        state.loading = false;
  
        state.products = action.payload;
  
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error if fetching fails
      }).addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log("vhebvherbve");
        state.products = action.payload; 
        console.log(state.items)
        // Store filtered products
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;

export default productSlice.reducer;
