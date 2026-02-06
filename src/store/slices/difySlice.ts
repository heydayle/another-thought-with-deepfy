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

            const { historyService } = await import('@/services/history');

            const MOCK_DATA = {
                log_id: crypto.randomUUID(),
                inputs,
                response: {
                    task_id: "116cac54-009d-431c-b8de-e832bda23c86",
                    workflow_run_id: "155d06f7-729b-43f8-b306-48fd0d327883",
                    data: {
                        id: "155d06f7-729b-43f8-b306-48fd0d327883",
                        workflow_id: "33d40ae6-f116-4c3f-a01c-40e10bdf4587",
                        status: "succeeded",
                        outputs: {
                            text_result: {
                                your_quote: "Bạn đang bước trên con đường phủ đầy ánh sáng, nơi mỗi bước chân đều nở hoa. Hạnh phúc không phải là điểm đến, mà là dòng sông êm đềm bạn đang lặng lẽ tắm mình, mang theo những hạt phấn vàng của hy vọng gieo vào từng khoảnh khắc.",
                                your_feeling: "Niềm hân hoan tinh khôi",
                                score: 9,
                                advice: "Hãy nuôi dưỡng ngọn lửa này bằng sự tỉnh thức - đặt một viên sỏi nhỏ vào túi áo làm kỷ vật cho ngày nắng đẹp, để khi gió mùa về, bạn vẫn có thể chạm vào hơi ấm của chính mình."
                            }
                        },
                        error: null,
                        elapsed_time: 9.050364,
                        total_tokens: 608,
                        total_steps: 3,
                        created_at: 1770443425,
                        finished_at: 1770270625
                    }
                },
                created_at: 1770443425
            }
            const workflow = {
                log_id: response.log_id || crypto.randomUUID(),
                inputs,
                response: {
                    ...response,
                    data: {
                        ...response.data,
                        created_at: dayjs().format('YYYY-MM-DD'),
                        finished_at: dayjs().format('YYYY-MM-DD')
                    }
                },
                created_at: dayjs().format('YYYY-MM-DD')
                // ...MOCK_DATA
            }
            await historyService.addRun(workflow);
            console.log(workflow);


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
