import {handleActions} from 'redux-actions';
import * as types from '../../constants/actionTypes';

let initialState = {
    isSidebarCollapsed: false,
    usePageWitchAnimation: false,
    pageHeaderFixed: true,
    queryBarFixed: false,
    pageAnimationType: 'right',
    randomPageAnimation: false,
};

export default handleActions({
    [types.SET_SETTING](state, action) {
        const {payload} = action;
        return {
            ...state,
            ...payload,
        };
    },
    [types.TOGGLE_SIDE_BAR](state) {
        const isSidebarCollapsed = !state.isSidebarCollapsed;
        return {
            ...state,
            isSidebarCollapsed,
        };
    },
    [types.GET_STATE_FROM_STORAGE](state, action) {
        const {payload} = action;
        return {
            ...state,
            ...(payload.setting || initialState),
        };
    },
}, initialState);
