import {handleActions} from 'redux-actions';
import * as types from '../../constants/actionTypes';

let initialState = {
    loading: false,
};

export default handleActions({
    [types.UPDATE_USER_PASS](state, action) {
        const {meta = {}} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';
        return {
            ...state,
            loading,
        };
    },
}, initialState);
