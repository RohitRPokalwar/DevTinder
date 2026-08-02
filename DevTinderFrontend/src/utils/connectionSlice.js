import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'connections',
    initialState: null,
    reducers: {
        addConnections: (state, actions) => {
            return actions.payload;
        },
        removeConnection: (state, actions) => {
            return null;
        }
    }
})

export const { addConnections, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;