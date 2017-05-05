import * as _promiseAjax from './utils/promise-ajax';
import * as _PubSubMsg from './utils/pubsubmsg';

export Router, {initRouter} from './route/Router';
export {initActions} from './redux/actions';
export {initReducers} from './redux/reducers';
export configureStore from './redux/store/configure-store';
export handleAsyncReducer from './redux/store/handle-async-reducer';
export ajax from './utils/ajax-decorator';
export const promiseAjax = _promiseAjax;
export const PubSubMsg = _PubSubMsg;
export const isDev = process.env.NODE_ENV === 'development';
export const isPro = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const isRC = process.env.NODE_ENV === 'rc';
