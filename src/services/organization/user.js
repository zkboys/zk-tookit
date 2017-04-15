import * as Storage from '../../utils/storage';
import * as request from '../request';
import config from '../../configs';

export function getUsersByParams(params) {
    return request.get('/organization/users', params)
        .then(data => data);
}

export function toggleLock(params) {
    return request.put('/organization/users/toggle_lock', params)
        .then(data => data);
}

export function addUser(params) {
    return request.post('/organization/users', params)
        .then(data => data);
}

export function updateUser(params) {
    return request.put('/organization/users', params)
        .then(data => data);
}

export function deleteUser(params) {
    return request.del('/organization/users', params)
        .then(data => data);
}

export function resetUserPass(params) {
    return request.put('/organization/users/reset_pass', params)
        .then(data => data);
}


/**
 * 获取当前登陆用户数据，如果获取失败，跳转登录。
 * @returns {object}
 */
export function getCurrentLoginUser() {
    // 这个session是浏览器tab页关闭就清除
    // 后台存放用户信息的session是浏览器窗口关闭才失效
    // 如果关闭tab，前端session清除，后端session未清除，后端允许跳转未登录页面（对于后端来说，是已经登录状态）
    // 调用如下代码，就会返回null，然后报错。
    // 调用signout接口，清除后端得session，重新跳转当前页面，就会重新走登录。
    // 这样关闭tab页，就算用户退出登录。
    const currentLoginUser = Storage.session.getItem('currentLoginUser');
    const pathName = location.pathname;
    if (!currentLoginUser) {
        if (process.env.NODE_ENV === 'development') {
            location.href = config.signInPath;
            return currentLoginUser;
        }
        request
            .post('/signout')
            .then(() => location.href = pathName, () => location.href = config.signInPath);
    }
    return currentLoginUser;
}

/**
 * 当前登录用户是否有某个权限
 * @param permission
 */
export function hasPermission(permission) {
    const currentLoginUser = getCurrentLoginUser();
    const permissions = currentLoginUser.permissions;
    let has = false;
    if (permissions) {
        has = permissions.indexOf(permission) > -1;
    }
    return has;
}

