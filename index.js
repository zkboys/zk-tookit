import * as _promiseAjax from './utils/promise-ajax';
import * as _PubSubMsg from './utils/pubsubmsg';

export Router, {initRouter} from './route/Router';
export {initActions} from './redux/actions';
export {initReducers} from './redux/reducers';
export configureStore from './redux/store/configure-store';
export handleAsyncReducer from './redux/store/handle-async-reducer';
export const promiseAjax = _promiseAjax;
export const PubSubMsg = _PubSubMsg;
export const isDev = process.env === 'development';
export const isPro = process.env === 'production';
export const isTest = process.env === 'test';
export const isRC = process.env === 'rc';
