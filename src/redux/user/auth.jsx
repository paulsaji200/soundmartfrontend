import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // Check if payload is null
            if (action.payload) {
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
            }
        },

        logout: (state) => {
            
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
             
           
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
