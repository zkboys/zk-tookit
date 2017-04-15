import {handleActions} from 'redux-actions';
import * as types from '../../constants/actionTypes';

let initialState = {
    loading: false,
};

export default handleActions({
    [types.UPDATE_USER_MESSAGE](state, action) {
        const {/* error, */meta = {}} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';

        // loading 要反应到页面上， error由middleware处理，全局message提示，或者各个页面添加回调处理
        // 由于业务简单，页面只需要知道loading状态，成功失败都由全局处理了。这里就不用判断了，直接返回loading状态
        /*
         if (loading || error) {
         return {
         ...state,
         loading,
         };
         }
         */
        return {
            ...state,
            loading,
        };
    },
}, initialState);
