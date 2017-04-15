import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';

export const toggleSideBar = createAction(types.TOGGLE_SIDE_BAR, () => ({}), () => ({sync: 'setting'}));
export const setSettings = createAction(types.SET_SETTING, data => data, () => ({sync: 'setting'}));
