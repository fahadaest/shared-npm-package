import { RootState } from './store';
import { AnyAction } from 'redux';

// Initial state for the config
const initialState = {
    model: 'default-model', // Dummy default model value
    noteHighlightColor: 'yellow', // Dummy default highlight color
    logoAnimation: false, // Dummy default logo animation state
};

// Action Types
const SET_LOGO_ANIMATION = 'SET_LOGO_ANIMATION';

// Action Creators
export const configActions = {
    updateConfig: (config: any) => {
        console.log('Updating config:', config);
    },
    setLogoAnimation: (isAnimating: boolean) => ({
        type: SET_LOGO_ANIMATION,
        payload: isAnimating,
    }),
};

// Selectors with dummy values
export const configSelectors = {
    getConfig: () => ({
        model: 'dummy-model',
        noteHighlightColor: 'blue',
        logoAnimation: true,
    }),
    selectModel: (state: RootState) => 'dummy-model',
    selectNoteHighlightColor: (state: RootState) => 'blue',
    selectLogoAnimation: (state: RootState) => true,
};

// Reducer
const configReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case SET_LOGO_ANIMATION:
            return {
                ...state,
                logoAnimation: action.payload,
            };
        default:
            return state;
    }
};

// Exporting the reducer
export default configReducer;
