import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WorkflowRunResponse } from '@/services/dify';
import { runWorkflow } from '@/services/dify';
import dayjs from 'dayjs';
import { parseTextResult } from '@/utils/help';

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

export const executeWorkflow = createAsyncThunk(
    'dify/executeWorkflow',
    async (inputs: Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await runWorkflow(inputs);

            // Parse text_result if it's a string
            if (response.data.outputs.text_result && typeof response.data.outputs.text_result === 'string') {
                const parsed = parseTextResult(response.data.outputs.text_result);
                if (parsed) {
                    response.data.outputs.text_result = parsed;
                }
            }

            // Save to IndexedDB
            const { historyService } = await import('@/services/history');
            await historyService.addRun({
                log_id: response.log_id || crypto.randomUUID(), // Ensure we have an ID
                inputs,
                response,
                created_at: dayjs().unix()
            });

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
