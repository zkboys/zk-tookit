import axios from 'axios';
import './promise-extends'; // 扩展了 done 和 finally 方法
import {mosaicUrl} from './index';

const instance = axios.create();
export const mockInstance = axios.create();

let onShowErrorTip = () => {
};
let onShowSuccessTip = () => {
};
let isMock = () => {
};
/**
 * 初始化promise-ajax 组件，方法：
 *
 * setOptions(instance[, isMock])，
 * onShowErrorTip(err, showErrorTip)，
 * onShowSuccessTip(response, showSuccessTip)，
 * isMock(url, data, method, options)
 * @param opt
 */
export function init(opt) {
    if (opt.setOptions) {
        const setOptions = opt.setOptions;
        setOptions(instance);
        setOptions(mockInstance, true); // isMock
    }

    if (opt.onShowErrorTip) {
        onShowErrorTip = opt.onShowErrorTip;
    }
    if (opt.onShowSuccessTip) {
        onShowSuccessTip = opt.onShowSuccessTip;
    }
    if (opt.isMock) {
        isMock = opt.isMock;
    }
}

function _setOptions(axiosInstance) {
    axiosInstance.defaults.timeout = 5000;
    axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axiosInstance.defaults.baseURL = '/';
    // Add a request interceptor
    axiosInstance.interceptors.request.use(cfg => {
        // Do something before request is sent
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

_setOptions(instance);
_setOptions(mockInstance);

function fetch(url, data, method = 'get', options = {}) {
    let {successTip = false, errorTip = method === 'get' ? '获取数据失败！' : '操作失败！'} = options;
    let showSuccessTip = successTip !== false;
    let showErrorTip = errorTip !== false;
    const CancelToken = axios.CancelToken;
    let cancel;
    const isGet = method === 'get';
    const _isMock = isMock(url, data, method, options);
    let axiosInstance = instance;

    if (isGet && !_isMock) {
        url = mosaicUrl(url, data);
    }
    if (_isMock) {
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
            onShowSuccessTip(response, showSuccessTip);
            resolve(response.data);
        }, err => {
            const isCanceled = err && err.message && err.message.canceled;
            if (isCanceled) return; // 如果是用户主动cancel，不做任何处理，不会触发任何函数
            onShowErrorTip(err, showErrorTip);
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
