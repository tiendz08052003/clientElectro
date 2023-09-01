import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as ProductServices from '~/services/ProductServices';
import * as BrandServices from '~/services/BrandServices';
import * as ColorServices from '~/services/ColorServices';
import * as TypeServices from '~/services/TypeServices';

const homeSlice = createSlice({
    name: 'products',
    initialState: {
        status: 'idle',
        productList: [],
        brandList: [],
        colorList: [],
        typeList: [],
        typeSort: "",
        quality: 20,
        numberPage: 0,
    },  
    extraReducers: builder => {
        builder
            .addCase(getProduct.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.productList = action.payload;
            })
            .addCase(getBrand.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.brandList = action.payload;
            })
            .addCase(getColor.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.colorList = action.payload;
            })
            .addCase(getType.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.typeList = action.payload;
            })
            .addCase(getTypeSort.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.typeSort = action.payload;
            })
            .addCase(getQuality.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.quality = action.payload;
            })
            .addCase(getNumberPage.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.numberPage = action.payload;
            })
    }
})

export const getProduct = createAsyncThunk("productList/getProduct", async () => {
    const res = await ProductServices.shop(); 
    return res;
})

export const getBrand = createAsyncThunk("BrandList/getBrand", async () => {
    const res = await BrandServices.getBrand(); 
    return res;
})

export const getColor = createAsyncThunk("ColorList/getColor", async () => {
    const res = await ColorServices.getColor(); 
    return res;
})

export const getType = createAsyncThunk("ColorList/getType", async () => {
    const res = await TypeServices.getType(); 
    return res;
})

export const getTypeSort = createAsyncThunk("ColorList/getTypeSort", (data) => {
    return data
})

export const getQuality = createAsyncThunk("ColorList/getQuality", (data) => {
    return data
})

export const getNumberPage = createAsyncThunk("ColorList/getNumberPage", (data) => {
    return data
})


export default homeSlice