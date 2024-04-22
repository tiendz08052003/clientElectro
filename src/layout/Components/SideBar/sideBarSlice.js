import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState: {
        brand: [],
        color: [],
        type: "",
        detailsType: ""
    },
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(listBrand.fulfilled, (state, action) => {
                if(action.payload.type === "single") {
                    state.brand = [action.payload.name];
                }
                else if(action.payload.type === "custom") {
                    let indexEle;
                    state.brand.map((x, index) => {
                        if(x === action.payload.name)
                        {
                            indexEle = index;
                        }
                    })
                    indexEle !== undefined || indexEle === 0 ? state.brand.splice(indexEle, 1) : state.brand.push(action.payload.name);
                }
                else {
                    state.brand = [];
                }
            })

            .addCase(listColor.fulfilled, (state, action) => {
                if(action.payload.type === "custom") {
                    let indexEle;
                    state.color.map((x, index) => {
                        if(x === action.payload.name)
                        {
                            indexEle = index;
                        }
                    })
                    indexEle !== undefined || indexEle === 0 ? state.color.splice(indexEle, 1) : state.color.push(action.payload.name);
                }
                else {
                    state.color = [];
                }
            })

            .addCase(type.fulfilled, (state, action) => {
                state.type = action.payload;
            })

            .addCase(detailsType.fulfilled, (state, action) => {
                state.detailsType = action.payload;
            })

    }
})


export const listBrand = createAsyncThunk("sideBar/listBrand", (data) => {
    return data;
}) 

export const listColor = createAsyncThunk("sideBar/listColor", (data) => {
    return data;
})  

export const type = createAsyncThunk("sideBar/type", (data) => {
    return data;
}) 

export const detailsType = createAsyncThunk("sideBar/detailsType", (data) => {
    return data;
}) 

export default sideBarSlice