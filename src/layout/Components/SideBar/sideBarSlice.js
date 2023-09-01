import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState: {
        brand: [],
        color: [],
        type: "",
        selection: "",
    },
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(brandList.fulfilled, (state, action) => {
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

            .addCase(colorList.fulfilled, (state, action) => {
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

            .addCase(typeList.fulfilled, (state, action) => {
                state.type = action.payload;
            })

            .addCase(selectionList.fulfilled, (state, action) => {
                state.selection = action.payload;
            })
    }
})


export const brandList = createAsyncThunk("sideBar/brandList", (data) => {
    return data;
}) 

export const colorList = createAsyncThunk("sideBar/colorList", (data) => {
    return data;
})  

export const typeList = createAsyncThunk("sideBar/typeList", (data) => {
    return data;
}) 

export const selectionList = createAsyncThunk("sideBar/selectionList", (data) => {
    return data;
}) 

export default sideBarSlice