import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as ProductCatalogServices from "~/services/ProductCatalogServices";

const headerBodySlice = createSlice({
    name: "headerFooter",
    initialState: {

        productCatalog: [],
        catalog: "",
        price: {
            min: 0,
            max: 0
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getProductCatalog.fulfilled, (state, action) => {
                state.productCatalog = action.payload;
            })
            .addCase(getIdCatalog.fulfilled, (state, action) => {
                state.catalog = action.payload;
            })
            .addCase(getPriceCatalog.fulfilled, (state, action) => {
                state.price = action.payload;
            })
    }
})

export const getProductCatalog = createAsyncThunk("header/getProductCatalog", async () => {
    const data = await ProductCatalogServices.getProductCatalog();
    return data;
})

export const getIdCatalog = createAsyncThunk("header/getIdCatalog", (id) => {
    return id;
})

export const getPriceCatalog = createAsyncThunk("header/getPriceCatalog", (data) => {
    return data;
})

export default headerBodySlice;