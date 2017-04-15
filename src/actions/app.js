import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import {getCurrentLoginUser, getMenuData} from '../commons/index';
import * as promiseAjax from '../commons/promise-ajax';

export const logout = createAction(types.LOGOUT, () => promiseAjax.post('/adminLogin/loginOut', {}, {errorTip: false}));
export const getMenus = createAction(types.GET_MENUS,
    (params = {}) => {
        const {fromServer = false} = params;
        return getMenuData(fromServer);
    },
    (params = {}) => {
        const {resolved, rejected} = params;
        return {
            resolved,
            rejected,
        };
    });
export const getCurrentUser = createAction(types.GET_CURRENT_USER, () => getCurrentLoginUser());
export const updateCurrentUser = createAction(types.UPDATE_CURRENT_USER);
export const autoSetSideBarStatus = createAction(types.AUTO_SET_SIDE_BAR_STATUS, () => getMenuData());
export const autoSetHeaderMenuStatus = createAction(types.AUTO_SET_HEADER_MENU_STATUS, () => getMenuData());
export const autoSetPageHeaderStatus = createAction(types.AUTO_SET_PAGE_HEADER_STATUS, () => getMenuData());
export const setPageHeaderStatus = createAction(types.SET_PAGE_HEADER_STATUS, (options) => {
    return new Promise((resolve) => { // 这样写为了解决一个bug，当时没做记录，忘记了。。。
        setTimeout(() => resolve(options), 100);
    });
});
export const setPageStatus = createAction(types.SET_PAGE_STATUS);
export const openTabPage = createAction(types.OPEN_TAB_PAGE);
