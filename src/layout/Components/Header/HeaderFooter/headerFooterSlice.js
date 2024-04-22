import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const headerBodySlice = createSlice({
    name: "headerFooter",
    initialState: {
        idDetailsCatalog: "",
        price: {
            min: 0,
            max: 0
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getIdDetailsCatalog.fulfilled, (state, action) => {
                state.idDetailsCatalog = action.payload;
            })
            .addCase(getPriceCatalog.fulfilled, (state, action) => {
                state.price = action.payload;
            })
    }
})

export const getIdDetailsCatalog = createAsyncThunk("header/getIdDetailsCatalog", (id) => {
    return id;
})

export const getPriceCatalog = createAsyncThunk("header/getPriceCatalog", (data) => {
    return data;
})

export default headerBodySlice;