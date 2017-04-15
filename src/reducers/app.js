import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';
import config from '../configs';
import {getHeaderMenus, getCurrentHeaderMenuByUrl, convertToTree, getCurrentSidebarMenuByUrl} from '../utils';
import {session} from '../utils/storage';
import {setCurrentLoginUser} from '../commons/index';

let initialState = {
    headerMenus: [],
    sideBarMenus: [],
    sideBarHidden: false,
    user: {
        name: '尚未登录',
    },
    selectedKeys: '',
    openKeys: [],
    currentHeaderKey: '',
    pageHeader: {},
    pageStatus: 'entered',
    tabPages: [],
    activeTabPageId: '',
};

export default handleActions({
    [types.LOGOUT](state, action) {
        const {meta = {}, error} = action;
        const {sequence = {}} = meta;
        const status = sequence.type === 'start';

        if (status || error) {
            return state;
        }
        setCurrentLoginUser(null);
        window.location.href = config.signInPath;

        return state;
    },
    [types.GET_CURRENT_USER](state, action) {
        const {payload} = action;

        return {
            ...state,
            user: payload,
        };
    },
    [types.UPDATE_CURRENT_USER](state, action) {
        const {payload} = action;
        const newUser = {...state.user, ...payload};

        session.setItem('currentLoginUser', newUser);

        return {
            ...state,
            user: newUser,
        };
    },
    [types.GET_MENUS](state, action) {
        const {payload} = action;

        if (!payload || !payload.length) {
            return {
                ...state,
            };
        }

        let headerMenus = getHeaderMenus(payload);
        let headMenu = getCurrentHeaderMenuByUrl(headerMenus);
        let sideBarMenus = [];

        if (headMenu) {
            sideBarMenus = convertToTree(payload, headMenu);
        }

        const sideBarHidden = !sideBarMenus.length;
        headerMenus = headerMenus.filter(menu => menu.key !== 'system');

        return {
            ...state,
            headerMenus,
            sideBarMenus,
            sideBarHidden,
        };
    },
    [types.AUTO_SET_SIDE_BAR_STATUS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const status = sequence.type === 'start';

        if (status || error) {
            return state;
        }

        const {parentKeys: openKeys, key: selectedKeys} = getCurrentSidebarMenuByUrl(payload) || state;

        return {
            ...state,
            openKeys,
            selectedKeys,
        };
    },
    [types.AUTO_SET_HEADER_MENU_STATUS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const status = sequence.type === 'start';

        if (status || error) {
            return state;
        }

        const {key: currentHeaderKey} = getCurrentHeaderMenuByUrl(payload) || state;

        return {
            ...state,
            currentHeaderKey,
        };
    },
    [types.AUTO_SET_PAGE_HEADER_STATUS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const status = sequence.type === 'start';

        if (status || error) {
            return state;
        }

        const {parentNodes, text, icon} = getCurrentSidebarMenuByUrl(payload) || {};
        const breadcrumb = [];

        if (parentNodes && parentNodes.length) {
            parentNodes.forEach(node => {
                breadcrumb.push({
                    icon: node.icon,
                    text: node.text,
                    path: node.path,
                });
            });
        }

        breadcrumb.push({
            icon,
            text,
        });

        return {
            ...state,
            pageHeader: {
                hidden: false,
                title: text,
                breadcrumb,
            },
        };
    },
    [types.SET_PAGE_HEADER_STATUS](state, action) {
        const {payload} = action;

        return {
            ...state,
            pageHeader: {...state.pageHeader, ...payload},
        };
    },
    [types.SET_PAGE_STATUS](state, action) {
        const {payload} = action;

        return {
            ...state,
            pageStatus: payload,
        };
    },
    [types.OPEN_TAB_PAGE](state, action) {
        const {payload} = action;
        return {
            ...state,
            tabPages: payload,
        };
    },
}, initialState);
