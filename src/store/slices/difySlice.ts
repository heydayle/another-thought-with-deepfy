import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WorkflowRunResponse } from '@/services/dify';
import { runWorkflow } from '@/services/dify';

interface DifyState {
    result: WorkflowRunResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: DifyState = {
    result: null,
    loading: false,
    error: null,
};

// Async Thunk for running the workflow
export const executeWorkflow = createAsyncThunk(
    'dify/executeWorkflow',
    async (inputs: Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await runWorkflow(inputs);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to run workflow');
        }
    }
);

const difySlice = createSlice({
    name: 'dify',
    initialState,
    reducers: {
        clearResult: (state) => {
            state.result = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(executeWorkflow.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.result = null;
            })
            .addCase(executeWorkflow.fulfilled, (state, action: PayloadAction<WorkflowRunResponse>) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(executeWorkflow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearResult } = difySlice.actions;
export default difySlice.reducer;
