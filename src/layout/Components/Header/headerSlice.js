import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const headerSlice = createSlice({
    name: "header",
    initialState: {
        valueSearch: "",
        resultSearch: [],
        conditionSearch: "",
    },
    extraReducers: builder => {
        builder
            .addCase(getValueSearch.fulfilled, (state, action) => {
                state.valueSearch = action.payload;
            })
            .addCase(getResultSearch.fulfilled, (state, action) => {
                state.resultSearch = action.payload;
            })
            .addCase(getConditionSearch.fulfilled, (state, action) => {
                state.conditionSearch = action.payload;
            })
    }
})

export const getValueSearch = createAsyncThunk("header/getValueSearch", (data) => {
    return data;
})

export const getResultSearch = createAsyncThunk("header/getResultSearch", (data) => {
    return data;
})

export const getConditionSearch = createAsyncThunk("header/getConditionSearch", (data) => {
    return data;
})

export default headerSlice;