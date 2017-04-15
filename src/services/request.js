import qs from 'query-string';
import 'whatwg-fetch';
import config from '../configs';

const urlPrefix = config.apiPath;

/**
 * 统一处理请求参数
 * @param params
 * @returns {{}}
 */
function filterParams(params = {}) {
    const dom = document.querySelector('meta[name="csrf-token"]');
    params._csrf = dom && dom.getAttribute('content');
    return params;
}

/**
 * 根据返回的状态，对结果进行不同的处理
 * @param res
 * @returns {*}
 */
function filterStatus(res) {
    const status = res.status;
    const statusText = res.statusText;

    if (status >= 200 && status < 300) {
        return res;
    }

    if (status === 401) {
        window.location.href = config.signInPath;
    }

    return res.json().then(body => {
        let error = new Error(statusText);
        error.body = body;
        error.type = 'http';
        error.status = status;
        throw error;
    });
}

/**
 * 处理返回的结果，
 * @param res
 * @returns promise
 */
function filterJSON(res) {
    return res.json(); // res.json() 是一个promise
}

export function get(url, params) {
    params = filterParams(params);
    url = urlPrefix + url;
    if (params) {
        url += `?${qs.stringify(params)}`;
    }

    return fetch(url, {
        credentials: 'same-origin', // 携带cookie，否则前后端分离开发，无法请求后端数据。
    })
        .then(filterStatus)
        .then(filterJSON);
}


export function post(url, body) {
    body = filterParams(body);
    url = urlPrefix + url;
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(filterStatus)
        .then(filterJSON);
}

export function put(url, body) {
    body = filterParams(body);
    url = urlPrefix + url;
    return fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(filterStatus)
        .then(filterJSON);
}

export function del(url, body) {
    body = filterParams(body);
    url = urlPrefix + url;
    return fetch(url, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(filterStatus)
        .then(filterJSON);
}
