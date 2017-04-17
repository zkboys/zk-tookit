import {combineReducers} from 'redux';
import utils from './utils';
import pageState from './page';

let reducers = {
    pageState,
    utils,
};

export function initReducers(newReducers) {
    // TODO 重复key检测
    reducers = {...reducers, ...newReducers};
}

export default combineReducers(reducers);
