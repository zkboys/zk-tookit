import {message} from 'antd';
import * as promiseAjax from './promise-ajax';

// TODO 已经废弃，使用 promise-ajax替换项目中的代码
function ajax(method) {
    return ({
        url = null,
        params = {},
        successTip = false, // false 表示不显示
        errorTip = '操作失败', // false 表示不显示
        beforeSend = () => {
        },
        success = () => {
        },
        error = () => {
        },
        complete = () => { // 完成，无论success error 都会
        },
    }) => {
        if (method === 'get') {
            errorTip = '获取数据失败';
        }
        let showSuccessTip = successTip !== false;
        let showErrorTip = errorTip !== false;
        beforeSend();
        return promiseAjax[method](url, params, {errorTip: false}).then(res => {
            success(res);
            complete();
            if (showSuccessTip) {
                message.success(successTip, 3);
            }
        }, err => {
            if (err && err.response && err.response.data && err.response.data.message && err.response.data.message.startsWith('timeout of')) {
                errorTip = '请求超时！';
            }
            error(err);
            complete();
            if (showErrorTip) {
                // TODO 根据前后端约定，从err中提取错误信息 赋值 errorTip
                message.error(errorTip, 3);
            }
        });
    };
}
export const get = ajax('get');
export const post = ajax('post');
export const put = ajax('put');
export const patch = ajax('patch');
export const del = ajax('del');

