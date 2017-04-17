import axios from 'axios';
import {message} from 'antd';
import config from '../config.js';
import {mosaicUrl} from '../utils';
import {getCurrentLoginUser, toLogin} from './index';


/* eslint-disable */
/**
 * Promise对象的回调链，不管以then方法或catch方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到
 * （因为Promise内部的错误不会冒泡到全局）。
 * 因此，我们可以提供一个done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。
 * @param callback
 * @returns {Promise<any|any|any|any>|Promise<any|any>|Promise.<*|*>}
 */
if (!Promise.prototype.finally) {
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => {
                throw reason;
            })
        );
    };
}


/**
 * finally方法用于指定不管Promise对象最后状态如何，都会执行的操作。
 * 它与done方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。
 * @param onFulfilled
 * @param onRejected
 */
if (!Promise.prototype.done) {
    Promise.prototype.done = function (onFulfilled, onRejected) {
        this.then(onFulfilled, onRejected)
            .catch(function (reason) {
                // 抛出一个全局错误
                setTimeout(() => {
                    throw reason;
                }, 0);
            });
    };
}

/* eslint-enable */

if (config.debug) {
    setTimeout(() => {
        require('../mock');

        console.log('mock start');
    });
}

const instance = axios.create();
export const mockInstance = axios.create();

function setOptions(axiosInstance) {
    const currentLoginUser = getCurrentLoginUser();
    axiosInstance.defaults.timeout = 5000;
    axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axiosInstance.defaults.baseURL = '/';
    axiosInstance.defaults.headers = {
        'auth-token': currentLoginUser && currentLoginUser.authToken,
    };

    if (config.debug) {
        // instance.defaults.baseURL = 'http://172.16.41.157:8080/';
        axiosInstance.defaults.baseURL = 'http://172.16.135.168:8080/';
        // instance.defaults.baseURL = 'http://172.16.20.57:8080/';
        // instance.defaults.baseURL = 'http://172.16.40.231:8080/';
    } else {
        axiosInstance.defaults.baseURL = '/api/';
    }

    // Add a request interceptor
    axiosInstance.interceptors.request.use(cfg => {
        // Do something before request is sent
        // TODO _xsrf 处理
        cfg.xsrfCookieName = '_xsrf';
        cfg.xsrfHeaderName = '_xsrf';
        return cfg;
    }, error => {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axiosInstance.interceptors.response.use(response => {
        // Do something with response data
        return response;
    }, error => {
        // Do something with response error
        return Promise.reject(error);
    });
}

setOptions(instance);
setOptions(mockInstance);

function fetch(url, data, method = 'get', options = {}) {
    let {successTip = false, errorTip = method === 'get' ? '获取数据失败！' : '操作失败！'} = options;
    let showSuccessTip = successTip !== false;
    let showErrorTip = errorTip !== false;
    const CancelToken = axios.CancelToken;
    let cancel;
    const isGet = method === 'get';
    const isMock = url.startsWith('/mock/');
    let axiosInstance = instance;

    if (isGet && !isMock) {
        url = mosaicUrl(url, data);
    }
    if (isMock) {
        axiosInstance = mockInstance;
        axiosInstance.defaults.baseURL = '/';
    }
    /* eslint-disable*/
    Promise.prototype.cancel = () => {
        cancel({
            canceled: true,
        });
    };
    /* eslint-enable*/
    return new Promise((resolve, reject) => {
        axiosInstance({
            method,
            url,
            data: isGet ? {} : data,
            cancelToken: new CancelToken(c => cancel = c),
            ...options,
        }).then(response => {
            showSuccessTip && message.success(successTip, 3);
            resolve(response.data);
        }, err => {
            const isCanceled = err && err.message && err.message.canceled;
            if (isCanceled) return; // 如果是用户主动cancel，不做任何处理，不会触发任何函数

            if (err.response && err.response.status === 401) {
                return toLogin();
            }

            if (showErrorTip) {
                if (err.response) {
                    const resData = err.response.data;
                    const {status} = err.response;
                    if (resData && resData.message) {
                        errorTip = resData.message;
                    }
                    if (status === 404) {
                        errorTip = '您访问的资源不存在！';
                    }
                    if (status === 403) {
                        errorTip = '您无权访问此资源！';
                    }
                    if (resData && resData.message && resData.message.startsWith('timeout of')) {
                        errorTip = '请求超时！';
                    }
                }
                message.error(errorTip, 3);
            }
            reject(err);
        }).catch(error => {
            reject(error);
        });
    });
}

export function get(url, params, options) {
    return fetch(url, params, 'get', options);
}

export function post(url, params, options) {
    return fetch(url, params, 'post', options);
}

export function put(url, params, options) {
    return fetch(url, params, 'put', options);
}

export function patch(url, params, options) {
    return fetch(url, params, 'patch', options);
}

export function del(url, params, options) {
    return fetch(url, params, 'delete', options);
}

const singleGets = {};
/**
 * 发送新的相同url请求，历史未结束相同url请求就会被打断，同一个url请求，最终只会触发一次
 * 用于输入框，根据输入远程获取提示等场景
 * @param url
 * @param params
 * @param options
 * @returns {*}
 */
export function singleGet(url, params, options) {
    const oldFetch = singleGets[url];
    if (oldFetch) {
        oldFetch.cancel();
    }
    const singleFetch = fetch(url, params, 'get', options);
    singleGets[url] = singleFetch;
    return singleFetch;
}
