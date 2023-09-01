import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const accountSlice = createSlice({
    name: "accounts",
    initialState: {
        status: 'idle',
        currentAccount: null,
    },
    extraReducers: builder => {
        builder
            .addCase(loginAccount.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loginAccount.rejected, (state) => {
                state.status = "rejected"
            })
            .addCase(loginAccount.fulfilled, (state, action) => {
                state.status = "fulfilled"
                state.currentAccount = action.payload
            })
            .addCase(logoutAccount.pending, (state) => {
                state.status = "loading"
            })
            .addCase(logoutAccount.rejected, (state) => {
                state.status = "rejected"
            })
            .addCase(logoutAccount.fulfilled, (state, action) => {
                state.status = "fulfilled"
                state.currentAccount = action.payload
            })
            .addCase(registerAccount.pending, (state) => {
                state.status = "loading"
            })
            .addCase(registerAccount.rejected, (state) => {
                state.status = "rejected"
            })
            .addCase(registerAccount.fulfilled, (state) => {
                state.status = "fulfilled"
            })
    }
})

export const loginAccount = createAsyncThunk("account/loginAccount", (data) => {
    return data
})

export const logoutAccount = createAsyncThunk("account/logoutAccount", (data) => {
    return data
})

export const registerAccount = createAsyncThunk("account/registerAccount", () => {
})



export default accountSlice