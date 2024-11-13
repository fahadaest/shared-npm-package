// // TODO update it later
import { configureStore } from '@reduxjs/toolkit';
import configReducer from './config';

const store = configureStore({
    reducer: {
        config: configReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
