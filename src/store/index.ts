import { configureStore } from '@reduxjs/toolkit';
import difyReducer from './slices/difySlice';

export const store = configureStore({
    reducer: {
        dify: difyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
