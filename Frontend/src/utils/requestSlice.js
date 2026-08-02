import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:'requests',
    initialState:null,
    reducers:{
        addRequests:(state , actions)=>{
            return actions.payload;
        },
        removeRequests:(state , actions)=>{
            return (state || []).filter((r)=>r._id !== actions.payload);
        }
    }
})

export const{addRequests , removeRequests}=requestSlice.actions;
export default requestSlice.reducer;