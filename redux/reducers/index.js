import {combineReducers} from 'redux';
import utils from './utils';
import pageState from './page';

export default combineReducers({
    pageState,
    utils,
});
