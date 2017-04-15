import {combineReducers} from 'redux';
import app from './app';
import utils from './utils';
import pageState from './page';

export default combineReducers({
    pageState,
    app,
    utils,
});
