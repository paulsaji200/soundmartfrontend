import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {

    const response = await api.get('admin/getcategories');
    console.log("helooooo")
       console.log(response)
    return response.data.data; 
  }
);

// Async thunk to add a category
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData) => {
    const response = await api.post('admin/addcategory', categoryData);
    return response.data.category;
  }
);

// Async thunk to update a category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...categoryData }) => {
    const response = await api.put(`admin/updatecategory/${id}`, categoryData);
    return response.data.category;
  }
);

// Async thunk to delete a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    await api.delete(`admin/deletecategory/${id}`);
    return id; // Return the id of the deleted category
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map(category =>
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          category => category._id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
