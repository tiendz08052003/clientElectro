import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as ProductServices from '~/services/ProductServices';
import * as BrandServices from '~/services/BrandServices';
import * as ColorServices from '~/services/ColorServices';
import * as TypeServices from '~/services/TypeServices';
import * as CatalogServices from '~/services/CatalogServices';
import * as CombineType_CatalogServices from '~/services/CombineType_CatalogServices';
import * as CombineDetailsCatalog_CombineType_Catalog from '~/services/CombineDetailsCatalog_CombineType_Catalog';
import * as CombineProduct_CombineDetailsCatalog_CombineType_Catalog from '~/services/combineProduct_CombineDetailsCatalog_CombineType_Catalog';
import * as DetailsTypeServices from '~/services/DetailsTypeServices';
import * as DetailsCatalogServices from '~/services/DetailsCatalogServices';

const homeSlice = createSlice({
    name: 'products',
    initialState: {
        status: 'idle',
        productList: [],
        brandList: [],
        colorList: [],
        typeList: [],
        catalogList: [],
        detailsTypeList: [],
        detailsCatalogList: [],
        combineType_CatalogList: [],
        combineDetailsCatalog_CombineType_CatalogList: [],
        combineProduct_CombineDetailsCatalog_CombineType_CatalogList: [],
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
            .addCase(getCatalog.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.catalogList = action.payload;
            })
            .addCase(getDetailsType.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.detailsTypeList = action.payload;
            })
            .addCase(getDetailsCatalog.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.detailsCatalogList = action.payload;
            })
            .addCase(getCombineType_Catalog.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.combineType_CatalogList = action.payload;
            })
            .addCase(getCombineDetailsCatalog_CombineType_Catalog.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.combineDetailsCatalog_CombineType_CatalogList = action.payload;
            })
            .addCase(getCombineProduct_CombineDetailsCatalog_CombineType_Catalog.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.combineProduct_CombineDetailsCatalog_CombineType_CatalogList = action.payload;
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

export const getCatalog = createAsyncThunk("ColorList/getCatalog", async () => {
    const res = await CatalogServices.getCatalog(); 
    return res;
})

export const getDetailsType = createAsyncThunk("ColorList/getDetailsType", async () => {
    const res = await DetailsTypeServices.getDetailsType(); 
    return res;
})

export const getDetailsCatalog = createAsyncThunk("ColorList/getDetailsCatalog", async () => {
    const res = await DetailsCatalogServices.getDetailsCatalog(); 
    return res;
})

export const getCombineType_Catalog = createAsyncThunk("ColorList/getCombineType_Catalog", async () => {
    const res = await CombineType_CatalogServices.getCombineType_Catalog(); 
    return res;
})

export const getCombineDetailsCatalog_CombineType_Catalog = createAsyncThunk("ColorList/getCombineDetailsCatalog_CombineType_Catalog", async () => {
    const res = await CombineDetailsCatalog_CombineType_Catalog.getCombineDetailsCatalog_CombineType_Catalog(); 
    return res;
})

export const getCombineProduct_CombineDetailsCatalog_CombineType_Catalog = createAsyncThunk("ColorList/getCombineProduct_CombineDetailsCatalog_CombineType_Catalog", async () => {
    const res = await CombineProduct_CombineDetailsCatalog_CombineType_Catalog.getCombineProduct_CombineDetailsCatalog_CombineType_Catalog(); 
    return res;
})





export default homeSlice