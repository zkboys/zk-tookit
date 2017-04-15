import {combineReducers} from 'redux';
import app from './app';
import setting from './system/setting';
import utils from './utils';
import profileMessage from './system/message';
import profilePass from './system/pass';
import pageState from './page';

export default combineReducers({
    pageState,
    profileMessage,
    profilePass,
    app,
    setting,
    utils,
});
