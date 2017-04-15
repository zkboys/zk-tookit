import TipMessage from './tip-message';
import * as promiseAjax from './promise-ajax';

export default {
    mobile(message) {
        // TODO 这个校验规则不是很好
        return {
            pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message,
        };
    },
    number(message) { // 正整数
        return {
            pattern: /^[0-9]+$/,
            message,
        };
    },
    integer(message) { // 整数
        return {
            pattern: /^[-]{0,1}[0-9]{1,}$/,
            message,
        };
    },
    email(message) {
        return {type: 'email', message: message || TipMessage.emailFormatError};
    },
    required(name) {
        return {required: true, message: TipMessage.canNotBeNull(name)};
    },
    loginName(message) {
        return {
            validator(rule, value, callback) {
                if (value && !(/^[a-zA-Z0-9\-_]+$/i).test(value)) {
                    callback(new Error(message || TipMessage.loginNameFormatError));
                } else {
                    callback();
                }
            },
        };
    },
    /**
     * 判断管理员登录名是否重复
     * @param ignoreValues {Array} 这些名字不进行检测，用于修改的情况。
     * @returns {*}
     */
    checkAdminLoginName(ignoreValues = []) {
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                promiseAjax
                    .get('/admins/checkLoginName', {loginName: value}, {errorTip: false})
                    .then(res => {
                        if (res) {
                            return callback([new Error('抱歉，该登录名已被占用！')]);
                        }
                        callback();
                    })
                    .catch(err => {
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    },
    /**
     * 检测Permission code 是否重复
     * @param ignoreValues
     * @returns {*}
     */
    checkPermissionCode(ignoreValues = []) {
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                promiseAjax
                    .get(`/authority/isExist/${value}`, {}, {errorTip: false})
                    .then(res => {
                        if (res) {
                            return callback([new Error('抱歉，该编码已被占用！')]);
                        }
                        callback();
                    })
                    .catch(err => {
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    },
    /**
     * 两个字段必填一个
     * @param field 另一个字段
     * @param form
     * @param errorTip
     * @returns {*}
     */
    twoFieldRelateRequired(field, form, errorTip) {
        const {getFieldValue, getFieldError, setFieldsValue} = form;
        return {
            validator(rule, value, callback) {
                const fieldValue = getFieldValue(field);
                if (!value && !fieldValue) {
                    return callback([new Error(errorTip)]);
                }
                if (value && !fieldValue && getFieldError(field)) {
                    setFieldsValue({[field]: ''});
                }
                callback();
            },
        };
    },
    /**
     * 检测系统编码是否重复
     * @param ignoreValues
     * @returns {*}
     */
    checkSystemCode(ignoreValues = []) {
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                promiseAjax
                    .get('/systems/checkCode', {code: value}, {errorTip: false})
                    .then(data => {
                        if (data) {
                            return callback([new Error('抱歉，系统编码已被占用！')]);
                        }
                        callback();
                    })
                    .catch(err => {
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    },
    /**
     * 判断角色名是否重复
     * @param ignoreValues {Array} 这些名字不进行检测，用于修改的情况。
     * @returns {*}
     */
    checkRoleNameExist(ignoreValues = []) {
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                promiseAjax
                    .get(`/organization/roles/name/${value}`, {}, {errorTip: false})
                    .then(data => {
                        if (data && value === data.name) {
                            return callback([new Error('抱歉，该角色名已被占用！')]);
                        }
                        callback();
                    })
                    .catch(err => {
                        console.log(err);
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    },

};
