import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    toast: {},
};

export default handleActions({
    [types.TOAST](state, action) {
        const {payload} = action;
        return {
            ...state,
            toast: {
                ...payload,
            },
        };
    },
}, initialState);
